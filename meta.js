/* Metadata at the byte level: finds what a file says about itself (camera, place, date, author)
   and builds a copy without it. Pictures are rewritten chunk by chunk, so nothing is re-compressed;
   audio and video are read in pieces, so a big file never has to fit in memory twice.
   index.html adds the parts that need libraries: EXIF decoding, PDF, Office files, Mediabunny. */
(function () {
  'use strict';

  const ascii = (b, o, n) => String.fromCharCode.apply(null, b.subarray(o, o + n));
  const latin1 = b => new TextDecoder('latin1').decode(b);
  const utf8 = b => new TextDecoder('utf-8').decode(b);
  const u16be = (b, o) => (b[o] << 8) | b[o + 1];
  const u32be = (b, o) => ((b[o] << 24) >>> 0) + ((b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]);
  const u32le = (b, o) => ((b[o + 3] << 24) >>> 0) + ((b[o + 2] << 16) | (b[o + 1] << 8) | b[o]);
  const setU32be = (b, o, v) => { b[o] = v >>> 24; b[o + 1] = v >>> 16; b[o + 2] = v >>> 8; b[o + 3] = v; };
  const setU32le = (b, o, v) => { b[o] = v; b[o + 1] = v >>> 8; b[o + 2] = v >>> 16; b[o + 3] = v >>> 24; };
  const bytes = s => Uint8Array.from(s, c => c.charCodeAt(0));
  function cat(parts) {
    const out = new Uint8Array(parts.reduce((a, p) => a + p.length, 0));
    let o = 0;
    for (const p of parts) { out.set(p, o); o += p.length; }
    return out;
  }
  async function rd(file, pos, len) { return new Uint8Array(await file.slice(pos, pos + len).arrayBuffer()); }
  // Text that hints at a place: GPS fields and the city and country fields of XMP and IPTC
  const PLACE = /GPS|photoshop:(City|State|Country)|Iptc4xmpCore:(Location|CountryCode)|Iptc4xmpExt:Location/;

  // ---------- EXIF (a small TIFF inside the file) ----------
  const TIFF_SIZES = [0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8];
  function tiff(b, t) {
    if (t + 8 > b.length) return null;
    const le = b[t] === 0x49 && b[t + 1] === 0x49;
    if (!le && !(b[t] === 0x4D && b[t + 1] === 0x4D)) return null;
    const u16 = o => t + o + 2 <= b.length ? (le ? b[t + o] | (b[t + o + 1] << 8) : u16be(b, t + o)) : 0;
    const u32 = o => t + o + 4 <= b.length ? (le ? u32le(b, t + o) : u32be(b, t + o)) : 0;
    if (u16(2) !== 42) return null;
    function ifd(o) {
      if (!o || t + o + 2 > b.length) return [];
      const out = [], n = Math.min(u16(o), 500);
      for (let i = 0; i < n; i++) {
        const e = o + 2 + i * 12;
        if (t + e + 12 > b.length) break;
        const type = u16(e + 2), count = u32(e + 4), size = (TIFF_SIZES[type] || 1) * count;
        out.push({ tag: u16(e), type, count, entry: e, size, val: size <= 4 ? e + 8 : u32(e + 8) });
      }
      return out;
    }
    return { le, u16, u32, ifd, ifd0: u32(4) };
  }
  function orientationOf(b, t) {
    const T = tiff(b, t);
    const e = T && T.ifd(T.ifd0).find(x => x.tag === 0x112);
    const o = e ? T.u16(e.val) : 1;
    return o >= 1 && o <= 8 ? o : 1;
  }
  // Zeroes the GPS block of an EXIF in place: its entries and every value they point to
  function wipeGps(b, t) {
    const T = tiff(b, t); if (!T) return false;
    const p = T.ifd(T.ifd0).find(x => x.tag === 0x8825); if (!p) return false;
    const go = T.u32(p.val), ents = T.ifd(go);
    for (const e of ents) if (e.size > 4 && t + e.val + e.size <= b.length) b.fill(0, t + e.val, t + e.val + e.size);
    if (go) b.fill(0, t + go, Math.min(b.length, t + go + 2 + ents.length * 12 + 4));
    return ents.length > 0;
  }
  // The only EXIF a cleaned photo keeps: which way up it is, so it doesn't turn sideways
  const orientExif = o => new Uint8Array([0x45, 0x78, 0x69, 0x66, 0, 0, 0x4D, 0x4D, 0, 0x2A, 0, 0, 0, 8, 0, 1, 0x01, 0x12, 0, 3, 0, 0, 0, 1, 0, o, 0, 0, 0, 0, 0, 0]);

  // ---------- JPEG ----------
  const XMP_NS = 'http://ns.adobe.com/xap/1.0/';
  const XMP_EXT = 'http://ns.adobe.com/xmp/extension/';
  function jpegSegments(b) {
    if (b[0] !== 0xFF || b[1] !== 0xD8) throw new Error('not a JPEG');
    const segs = [];
    let i = 2;
    while (i < b.length - 1) {
      if (b[i] !== 0xFF) { i++; continue; }
      const m = b[i + 1];
      if (m === 0xFF) { i++; continue; }
      if (m === 0xD9) { segs.push({ m, start: i, end: i + 2 }); return { segs, end: i + 2 }; }
      if (m === 0x01 || (m >= 0xD0 && m <= 0xD7)) { segs.push({ m, start: i, end: i + 2 }); i += 2; continue; }
      const len = u16be(b, i + 2);
      let end = i + 2 + len;
      if (end > b.length) throw new Error('broken JPEG');
      if (m === 0xDA) { // the picture itself runs until the next real marker
        while (end < b.length - 1 && !(b[end] === 0xFF && b[end + 1] !== 0 && !(b[end + 1] >= 0xD0 && b[end + 1] <= 0xD7))) end++;
        segs.push({ m, start: i, end, data: i + 4 });
      } else segs.push({ m, start: i, end, data: i + 4 });
      i = end;
    }
    return { segs, end: b.length };
  }
  function jpegKind(b, s) {
    const d = s.data;
    if (s.m === 0xE0) return ascii(b, d, 5) === 'JFIF\0' ? 'jfif' : 'app0';
    if (s.m === 0xE1) return ascii(b, d, 6) === 'Exif\0\0' ? 'exif' : ascii(b, d, XMP_NS.length) === XMP_NS ? 'xmp' : ascii(b, d, XMP_EXT.length) === XMP_EXT ? 'xmpext' : 'app1';
    if (s.m === 0xE2) return ascii(b, d, 12) === 'ICC_PROFILE\0' ? 'icc' : ascii(b, d, 4) === 'MPF\0' ? 'mpf' : 'app2';
    if (s.m === 0xED) return 'iptc';
    if (s.m === 0xEE) return ascii(b, d, 5) === 'Adobe' ? 'adobe' : 'app14';
    if (s.m === 0xFE) return 'com';
    if (s.m >= 0xE0 && s.m <= 0xEF) return 'app';
    return 'img';
  }
  // IPTC records 2:90 city, 2:92 sublocation, 2:95 state, 2:100 country code, 2:101 country
  const iptcPlace = seg => { for (let i = 0; i < seg.length - 2; i++) if (seg[i] === 0x1C && seg[i + 1] === 2 && [90, 92, 95, 100, 101].includes(seg[i + 2])) return true; return false; };
  function cleanJpeg(b, gpsOnly) {
    const { segs } = jpegSegments(b);
    const out = [b.subarray(0, 2)];
    let orient = 1, afterJfif = 1;
    for (const s of segs) {
      const kind = jpegKind(b, s);
      let seg = b.subarray(s.start, s.end);
      if (kind === 'exif') {
        orient = orientationOf(b, s.data + 6);
        if (!gpsOnly) continue;
        seg = seg.slice(); wipeGps(seg, 10);
      } else if (gpsOnly) {
        if ((kind === 'xmp' || kind === 'xmpext') && PLACE.test(latin1(seg))) continue;
        if (kind === 'iptc' && iptcPlace(seg)) continue;
        if (kind === 'mpf') continue;
      } else if (!['jfif', 'icc', 'adobe', 'img'].includes(kind)) continue;
      out.push(seg);
      if (kind === 'jfif') afterJfif = out.length;
    }
    // Anything after the end of the picture (extra previews, depth maps) goes too
    if (!gpsOnly && orient > 1) {
      const app = orientExif(orient), seg = new Uint8Array(4 + app.length);
      seg[0] = 0xFF; seg[1] = 0xE1; seg[2] = (app.length + 2) >> 8; seg[3] = (app.length + 2) & 255; seg.set(app, 4);
      out.splice(afterJfif, 0, seg);
    }
    return cat(out);
  }
  function readJpeg(b) {
    const r = { exif: null, xmp: '', comments: [], icc: false, extra: [] };
    const { segs, end } = jpegSegments(b);
    for (const s of segs) {
      const kind = jpegKind(b, s);
      if (kind === 'exif' && !r.exif) r.exif = b.slice(s.data + 6, s.end);
      else if (kind === 'xmp') r.xmp += utf8(b.subarray(s.data + XMP_NS.length + 1, s.end));
      else if (kind === 'com') r.comments.push(utf8(b.subarray(s.data, s.end)).replace(/\0+$/, ''));
      else if (kind === 'icc') r.icc = true;
      else if (kind === 'iptc') r.extra.push('IPTC');
      else if (kind === 'mpf') r.extra.push('MPF');
    }
    if (end < b.length - 16) r.trailer = b.length - end;
    return r;
  }

  // ---------- PNG ----------
  const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function crc32(b, s, e) { let c = 0xFFFFFFFF; for (let i = s; i < e; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  const PNG_SIG = [137, 80, 78, 71, 13, 10, 26, 10];
  function pngChunks(b) {
    if (!PNG_SIG.every((v, i) => b[i] === v)) throw new Error('not a PNG');
    const list = [];
    let i = 8;
    while (i + 12 <= b.length) {
      const len = u32be(b, i), type = ascii(b, i + 4, 4), end = i + 12 + len;
      if (end > b.length) throw new Error('broken PNG');
      list.push({ type, start: i, data: i + 8, end: end - 4, stop: end });
      i = end;
      if (type === 'IEND') break;
    }
    return list;
  }
  const PNG_DROP = new Set(['tEXt', 'zTXt', 'iTXt', 'eXIf', 'tIME', 'dSIG']);
  function cleanPng(b, gpsOnly) {
    const out = [b.subarray(0, 8)];
    for (const c of pngChunks(b)) {
      let ch = b.subarray(c.start, c.stop);
      if (gpsOnly) {
        if (/^[tzi]TXt$/.test(c.type) && PLACE.test(latin1(b.subarray(c.data, c.end)))) continue;
        if (c.type === 'eXIf') {
          ch = ch.slice();
          wipeGps(ch, 8 + (ascii(ch, 8, 4) === 'Exif' ? 6 : 0));
          setU32be(ch, ch.length - 4, crc32(ch, 4, ch.length - 4));
        }
      } else if (PNG_DROP.has(c.type)) continue;
      out.push(ch);
    }
    return cat(out);
  }
  function readPng(b) {
    const r = { exif: null, xmp: '', text: [], icc: false, time: null };
    for (const c of pngChunks(b)) {
      const d = b.subarray(c.data, c.end);
      if (c.type === 'eXIf') r.exif = d.slice(ascii(d, 0, 4) === 'Exif' ? 6 : 0);
      else if (c.type === 'iCCP') r.icc = true;
      else if (c.type === 'tIME' && d.length >= 7) r.time = new Date(Date.UTC(u16be(d, 0), d[2] - 1, d[3], d[4], d[5], d[6]));
      else if (c.type === 'tEXt' || c.type === 'zTXt' || c.type === 'iTXt') {
        const z = d.indexOf(0); if (z < 0) continue;
        const key = latin1(d.subarray(0, z));
        let value = '';
        if (c.type === 'tEXt') value = latin1(d.subarray(z + 1));
        else if (c.type === 'iTXt') {
          const compressed = d[z + 1];
          let p = d.indexOf(0, z + 3); p = d.indexOf(0, p + 1);
          value = compressed ? '…' : utf8(d.subarray(p + 1));
        } else value = '…';
        if (key === 'XML:com.adobe.xmp') r.xmp += value; else r.text.push([key, value]);
      }
    }
    return r;
  }

  // ---------- WEBP ----------
  function riffChunks(b, form) {
    if (ascii(b, 0, 4) !== 'RIFF' || ascii(b, 8, 4) !== form) throw new Error('not ' + form);
    const list = [];
    let i = 12;
    while (i + 8 <= b.length) {
      const id = ascii(b, i, 4), size = u32le(b, i + 4), end = Math.min(b.length, i + 8 + size + (size & 1));
      list.push({ id, start: i, data: i + 8, end: Math.min(b.length, i + 8 + size), stop: end });
      i = end;
    }
    return list;
  }
  function cleanWebp(b, gpsOnly) {
    const parts = [];
    let vp8x = null, exif = false, xmp = false;
    for (const c of riffChunks(b, 'WEBP')) {
      let ch = b.subarray(c.start, c.stop);
      if (c.id === 'EXIF') {
        if (!gpsOnly) continue;
        ch = ch.slice(); wipeGps(ch, 8 + (ascii(ch, 8, 4) === 'Exif' ? 6 : 0)); exif = true;
      } else if (c.id === 'XMP ') {
        if (!gpsOnly || PLACE.test(latin1(ch))) continue;
        xmp = true;
      } else if (c.id === 'VP8X') { ch = ch.slice(); vp8x = ch; }
      parts.push(ch);
    }
    if (vp8x) vp8x[8] &= ~((exif ? 0 : 0x08) | (xmp ? 0 : 0x04));
    const head = bytes('RIFF\0\0\0\0WEBP');
    setU32le(head, 4, 4 + parts.reduce((a, p) => a + p.length, 0));
    return cat([head, ...parts]);
  }
  function readWebp(b) {
    const r = { exif: null, xmp: '', icc: false };
    for (const c of riffChunks(b, 'WEBP')) {
      const d = b.subarray(c.data, c.end);
      if (c.id === 'EXIF') r.exif = d.slice(ascii(d, 0, 4) === 'Exif' ? 6 : 0);
      else if (c.id === 'XMP ') r.xmp += utf8(d);
      else if (c.id === 'ICCP') r.icc = true;
    }
    return r;
  }

  // ---------- GIF ----------
  function gifBlocks(b) {
    if (ascii(b, 0, 4) !== 'GIF8') throw new Error('not a GIF');
    const skipSub = j => { while (j < b.length && b[j] !== 0) j += b[j] + 1; return j + 1; };
    let i = 13;
    if (b[10] & 0x80) i += 3 * (2 << (b[10] & 7));
    const list = [{ kind: 'head', start: 0, end: i }];
    while (i < b.length) {
      const c = b[i];
      if (c === 0x3B) { list.push({ kind: 'end', start: i, end: i + 1 }); break; }
      if (c === 0x2C) {
        let j = i + 10;
        if (b[i + 9] & 0x80) j += 3 * (2 << (b[i + 9] & 7));
        j = skipSub(j + 1);
        list.push({ kind: 'image', start: i, end: j }); i = j; continue;
      }
      if (c === 0x21) {
        const label = b[i + 1], j = skipSub(i + 2);
        const app = label === 0xFF ? ascii(b, i + 3, 11) : '';
        list.push({ kind: label === 0xFE ? 'comment' : label === 0xFF ? 'app' : 'ext', app, start: i, end: j }); i = j; continue;
      }
      throw new Error('broken GIF');
    }
    return list;
  }
  const subText = (b, s, e) => { const out = []; let j = s; while (j < e && b[j]) { out.push(b.subarray(j + 1, j + 1 + b[j])); j += b[j] + 1; } return utf8(cat(out)); };
  function cleanGif(b) {
    const keep = gifBlocks(b).filter(k => k.kind !== 'comment' && !(k.kind === 'app' && k.app !== 'NETSCAPE2.0' && k.app !== 'ANIMEXTS1.0'));
    if (keep[keep.length - 1].kind !== 'end') keep.push({ start: 0, end: 0, tail: true });
    return cat(keep.map(k => k.tail ? new Uint8Array([0x3B]) : b.subarray(k.start, k.end)));
  }
  function readGif(b) {
    const r = { comments: [], apps: [], frames: 0 };
    for (const k of gifBlocks(b)) {
      if (k.kind === 'comment') r.comments.push(subText(b, k.start + 2, k.end));
      else if (k.kind === 'app' && k.app !== 'NETSCAPE2.0') r.apps.push(k.app.replace(/[^\x20-\x7e]/g, ''));
      else if (k.kind === 'image') r.frames++;
    }
    return r;
  }

  // ---------- SVG ----------
  function cleanSvg(s) {
    return s.replace(/<\?xpacket[\s\S]*?\?>/g, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<metadata\b[^>]*\/>/gi, '').replace(/<metadata\b[\s\S]*?<\/metadata>/gi, '')
      .replace(/<sodipodi:namedview\b[^>]*\/>/g, '').replace(/<sodipodi:namedview\b[\s\S]*?<\/sodipodi:namedview>/g, '')
      .replace(/\s(?:sodipodi|inkscape):[\w-]+="[^"]*"/g, '');
  }
  function readSvg(s) {
    const r = [];
    const pick = (re, label) => { const m = re.exec(s); if (m && m[1].trim()) r.push([label, m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()]); };
    pick(/<dc:title>([\s\S]*?)<\/dc:title>/, 'title');
    pick(/<dc:creator>([\s\S]*?)<\/dc:creator>/, 'author');
    pick(/<dc:rights>([\s\S]*?)<\/dc:rights>/, 'rights');
    pick(/<dc:date>([\s\S]*?)<\/dc:date>/, 'date');
    pick(/<dc:description>([\s\S]*?)<\/dc:description>/, 'description');
    pick(/sodipodi:docname="([^"]*)"/, 'docname');
    pick(/inkscape:export-filename="([^"]*)"/, 'exportPath');
    pick(/inkscape:version="([^"]*)"/, 'inkscape');
    pick(/<!--\s*(Generator:[\s\S]*?)-->/, 'generator');
    const comments = (s.match(/<!--[\s\S]*?-->/g) || []).length;
    return { fields: r, metadata: /<metadata\b/i.test(s), comments };
  }

  // ---------- MP3, AAC: ID3 tags at the start and at the end ----------
  function id3Len(h) { return ascii(h, 0, 3) === 'ID3' && h.length >= 10 ? 10 + ((h[6] & 127) << 21 | (h[7] & 127) << 14 | (h[8] & 127) << 7 | (h[9] & 127)) + (h[5] & 0x10 ? 10 : 0) : 0; }
  async function headSkip(file) {
    let s = 0, n;
    while ((n = id3Len(await rd(file, s, 10)))) s += n;
    return s;
  }
  async function tailCut(file, s) {
    let e = file.size;
    for (let guard = 0; guard < 4; guard++) {
      const t = await rd(file, Math.max(s, e - 160), Math.min(160, e - s)), L = t.length;
      if (L >= 128 && ascii(t, L - 128, 3) === 'TAG') { e -= 128; continue; }
      if (L >= 32 && ascii(t, L - 32, 8) === 'APETAGEX') { e -= u32le(t, L - 32 + 12) + (t[L - 32 + 23] & 0x80 ? 32 : 0); continue; }
      if (L >= 10 && ascii(t, L - 10, 3) === '3DI') { e -= 20 + ((t[L - 4] & 127) << 21 | (t[L - 3] & 127) << 14 | (t[L - 2] & 127) << 7 | (t[L - 1] & 127)); continue; }
      if (L >= 15 && ascii(t, L - 9, 9) === 'LYRICS200') { e -= 15 + (+ascii(t, L - 15, 6) || 0); continue; }
      break;
    }
    return Math.max(s, e);
  }
  async function cleanMp3(file) {
    const s = await headSkip(file), e = await tailCut(file, s);
    return file.slice(s, e, file.type);
  }

  // ---------- WAV ----------
  const WAV_DROP = new Set(['id3 ', 'ID3 ', 'bext', 'iXML', '_PMX', 'aXML', 'cart', 'XMP ']);
  async function wavChunks(file) {
    const h = await rd(file, 0, 12);
    if (ascii(h, 0, 4) !== 'RIFF' || ascii(h, 8, 4) !== 'WAVE') throw new Error('not a WAV');
    const list = [];
    let i = 12;
    while (i + 8 <= file.size) {
      const c = await rd(file, i, 12), id = ascii(c, 0, 4);
      let size = u32le(c, 4);
      if (id === 'data' && (size === 0xFFFFFFFF || i + 8 + size > file.size)) size = file.size - i - 8;
      const stop = Math.min(file.size, i + 8 + size + (size & 1));
      list.push({ id, sub: ascii(c, 8, 4), start: i, size, stop });
      i = stop;
    }
    return list;
  }
  async function cleanWav(file) {
    const keep = (await wavChunks(file)).filter(c => !WAV_DROP.has(c.id) && !(c.id === 'LIST' && c.sub === 'INFO'));
    const head = bytes('RIFF\0\0\0\0WAVE');
    setU32le(head, 4, Math.min(0xFFFFFFFF, 4 + keep.reduce((a, c) => a + c.stop - c.start, 0)));
    return new Blob([head, ...keep.map(c => file.slice(c.start, c.stop))], { type: file.type || 'audio/wav' });
  }
  async function readWav(file) {
    const r = { info: [], chunks: [] };
    for (const c of await wavChunks(file)) {
      if (c.id === 'LIST' && c.sub === 'INFO' && c.size < 1e6) {
        const d = await rd(file, c.start + 12, c.size - 4);
        let j = 0;
        while (j + 8 <= d.length) {
          const id = ascii(d, j, 4), n = u32le(d, j + 4);
          r.info.push([id, utf8(d.subarray(j + 8, j + 8 + n)).replace(/\0+$/, '')]);
          j += 8 + n + (n & 1);
        }
      } else if (WAV_DROP.has(c.id)) r.chunks.push(c.id.trim());
    }
    return r;
  }

  // ---------- FLAC ----------
  async function flacBlocks(file) {
    const s = await headSkip(file);
    if (ascii(await rd(file, s, 4), 0, 4) !== 'fLaC') throw new Error('not a FLAC');
    const list = [];
    let i = s + 4, last = false;
    while (!last && i + 4 <= file.size) {
      const h = await rd(file, i, 4);
      last = !!(h[0] & 0x80);
      const len = (h[1] << 16) | (h[2] << 8) | h[3];
      list.push({ type: h[0] & 0x7F, start: i, stop: i + 4 + len });
      i += 4 + len;
    }
    return { s, list, audio: i };
  }
  async function cleanFlac(file) {
    const { list, audio } = await flacBlocks(file);
    // Kept: stream info, seek table and cue sheet. Gone: tags, pictures, padding, application data
    const keep = await Promise.all(list.filter(k => [0, 3, 5].includes(k.type)).map(k => rd(file, k.start, k.stop - k.start)));
    keep.forEach((k, j) => { k[0] = (k[0] & 0x7F) | (j === keep.length - 1 ? 0x80 : 0); });
    const e = await tailCut(file, audio);
    return new Blob([bytes('fLaC'), ...keep, file.slice(audio, e)], { type: file.type || 'audio/flac' });
  }

  // ---------- MP4, MOV, M4A, 3GP ----------
  // Personal boxes become "free" boxes of the same size, so the video data doesn't move and nothing needs rewriting
  function eachBox(b, start, end, fn) {
    let i = start;
    while (i + 8 <= end) {
      let size = u32be(b, i), hdr = 8;
      const type = ascii(b, i + 4, 4);
      if (size === 1) { size = u32be(b, i + 8) * 4294967296 + u32be(b, i + 12); hdr = 16; }
      else if (size === 0) size = end - i;
      if (size < hdr || i + size > end) break;
      fn(type, i, hdr, size);
      i += size;
    }
  }
  function freeBox(b, i, hdr, size) { b.set(bytes('free'), i + 4); b.fill(0, i + hdr, i + size); }
  // QuickTime "meta" is a plain container, the ISO one starts with 4 bytes of version and flags
  const metaBody = (b, body) => ascii(b, body + 4, 4) === 'hdlr' ? body : body + 4;
  function metaKeys(b, body, end) {
    const keys = [];
    eachBox(b, metaBody(b, body), end, (t, i, hdr, size) => {
      if (t !== 'keys') return;
      let j = i + hdr + 8;
      const n = u32be(b, i + hdr + 4);
      for (let k = 0; k < n && j + 8 <= i + size; k++) { const ks = u32be(b, j); keys.push(utf8(b.subarray(j + 8, j + ks))); j += ks; }
    });
    return keys;
  }
  function cleanMoov(b, gpsOnly) {
    const walk = (start, end) => eachBox(b, start, end, (type, i, hdr, size) => {
      const body = i + hdr;
      if (type === 'mvhd' || type === 'tkhd' || type === 'mdhd') {
        if (!gpsOnly) b.fill(0, body + 4, body + (b[body] === 1 ? 20 : 12)); // created and modified
      } else if (type === 'moov' || type === 'trak' || type === 'mdia') walk(body, i + size);
      else if (!gpsOnly) { if (type === 'udta' || type === 'meta' || type === 'uuid') freeBox(b, i, hdr, size); }
      else if (type === 'udta') walk(body, i + size);
      else if (type === '\xa9xyz' || type === 'loci') freeBox(b, i, hdr, size);
      else if (type === 'meta') {
        const keys = metaKeys(b, body, i + size);
        eachBox(b, metaBody(b, body), i + size, (t, j, h2, s2) => {
          if (t !== 'ilst') return;
          eachBox(b, j + h2, j + s2, (it, k, h3, s3) => {
            const key = it === '\xa9xyz' ? 'xyz' : keys[u32be(b, k + 4) - 1] || '';
            if (key === 'xyz' || /location/i.test(key)) freeBox(b, k, h3, s3);
          });
        });
      }
    });
    walk(0, b.length);
    return b;
  }
  async function topBoxes(file) {
    const list = [];
    let pos = 0;
    while (pos + 8 <= file.size) {
      const h = await rd(file, pos, 16);
      let size = u32be(h, 0), hdr = 8;
      if (size === 1) { size = u32be(h, 8) * 4294967296 + u32be(h, 12); hdr = 16; } else if (size === 0) size = file.size - pos;
      if (size < hdr || pos + size > file.size) { list.push({ type: '', start: pos, size: file.size - pos, hdr: 0 }); break; }
      list.push({ type: ascii(h, 4, 4), start: pos, size, hdr });
      pos += size;
    }
    return list;
  }
  async function cleanMp4(file, gpsOnly) {
    const parts = [];
    for (const x of await topBoxes(file)) {
      if (x.type === 'moov' && x.size < 512e6) parts.push(cleanMoov(await rd(file, x.start, x.size), gpsOnly));
      else if (!gpsOnly && (x.type === 'uuid' || x.type === 'meta') && x.size < 64e6) { const b = await rd(file, x.start, x.size); freeBox(b, 0, x.hdr, x.size); parts.push(b); }
      else parts.push(file.slice(x.start, x.start + x.size));
    }
    return new Blob(parts, { type: file.type });
  }
  const MAC_EPOCH = Date.UTC(1904, 0, 1);
  async function readMp4(file) {
    const r = { created: null, modified: null, tags: [], xmp: false };
    for (const x of await topBoxes(file)) {
      if (x.type === 'uuid') r.xmp = true;
      if (x.type !== 'moov' || x.size > 512e6) continue;
      const b = await rd(file, x.start, x.size);
      const str = (s, e) => utf8(b.subarray(s, e)).replace(/\0+$/, '').trim();
      const walk = (start, end, inUdta) => eachBox(b, start, end, (type, i, hdr, size) => {
        const body = i + hdr;
        if (type === 'mvhd') {
          const v = b[body], t = v === 1 ? u32be(b, body + 8) : u32be(b, body + 4), m = v === 1 ? u32be(b, body + 16) : u32be(b, body + 8);
          if (t) r.created = new Date(MAC_EPOCH + t * 1000);
          if (m) r.modified = new Date(MAC_EPOCH + m * 1000);
        } else if (type === 'moov' || type === 'trak' || type === 'udta') walk(body, i + size, type === 'udta');
        else if (type === 'meta') {
          const keys = metaKeys(b, body, i + size);
          eachBox(b, metaBody(b, body), i + size, (t, j, h2, s2) => {
            if (t !== 'ilst') return;
            eachBox(b, j + h2, j + s2, (it, k, h3, s3) => {
              const key = it.charCodeAt(0) === 0xA9 ? it : keys[u32be(b, k + 4) - 1] || it;
              eachBox(b, k + h3, k + s3, (dt, d, h4, s4) => {
                if (dt !== 'data') return;
                const kind = u32be(b, d + h4) & 0xFFFFFF;
                const p = d + h4 + 8, n = d + s4 - p;
                if (kind === 1) r.tags.push([key, str(p, d + s4)]);
                else if (kind === 13 || kind === 14) r.tags.push([key, '[image]']);
                else if (kind === 21 || kind === 22) r.tags.push([key, String(n === 1 ? b[p] : n === 2 ? u16be(b, p) : n >= 4 ? u32be(b, p) : 0)]);
              });
            });
          });
        } else if (type === 'loci' && size > hdr + 20) {
          // 3GPP location: version, language, a place name, a role byte, then longitude, latitude, altitude in 16.16
          let j = body + 6;
          while (j < i + size && b[j]) j++;
          const fx = o => (((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) / 65536);
          if (j + 10 <= i + size) r.tags.push(['loci', `${fx(j + 6) >= 0 ? '+' : ''}${fx(j + 6).toFixed(4)}${fx(j + 2) >= 0 ? '+' : ''}${fx(j + 2).toFixed(4)}/`]);
          const name = str(body + 6, j);
          if (name) r.tags.push(['loci-name', name]);
        } else if (inUdta && type.charCodeAt(0) === 0xA9 && size > hdr + 4) {
          const n = u16be(b, body);
          if (n && body + 4 + n <= i + size) r.tags.push([type, str(body + 4, body + 4 + n)]);
        }
      });
      walk(0, b.length, false);
    }
    return r;
  }

  // ---------- Which country a point is in (offline: a world map of borders, no coordinates leave the browser) ----------
  const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json';
  const NUM = 'AF4AL8DZ12AS16AD20AO24AI660AQ10AG28AR32AM51AW533AU36AT40AZ31BS44BH48BD50BB52BY112BE56BZ84BJ204BM60BT64BO68BA70BW72BV74BR76IO86BN96BG100BF854BI108KH116CM120CA124CV132KY136CF140TD148CL152CN156CX162CC166CO170KM174CG178CD180CK184CR188CI384HR191CU192CY196CZ203DK208DJ262DM212DO214EC218EG818SV222GQ226ER232EE233ET231FK238FO234FJ242FI246FR250GF254PF258TF260GA266GM270GE268DE276GH288GI292GR300GL304GD308GP312GU316GT320GN324GW624GY328HT332HM334VA336HN340HK344HU348IS352IN356ID360IR364IQ368IE372IL376IT380JM388JP392JO400KZ398KE404KI296KP408KR410KW414KG417LA418LV428LB422LS426LR430LY434LI438LT440LU442MO446MG450MW454MY458MV462ML466MT470MH584MQ474MR478MU480YT175MX484FM583MD498MC492MN496MS500MA504MZ508MM104NA516NR520NP524NL528NC540NZ554NI558NE562NG566NU570NF574MK807MP580NO578OM512PK586PW585PS275PA591PG598PY600PE604PH608PN612PL616PT620PR630QA634RE638RO642RU643RW646SH654KN659LC662PM666VC670WS882SM674ST678SA682SN686SC690SL694SG702SK703SI705SB90SO706ZA710GS239ES724LK144SD729SR740SJ744SZ748SE752CH756SY760TW158TJ762TZ834TH764TL626TG768TK772TO776TT780TN788TR792TM795TC796TV798UG800UA804AE784GB826US840UM581UY858UZ860VU548VE862VN704VG92VI850WF876EH732YE887ZM894ZW716AX248BQ535CW531GG831IM833JE832ME499BL652MF663RS688SX534SS728XK0';
  const BY_NUM = {};
  NUM.replace(/([A-Z]{2})(\d+)/g, (m, a, n) => { BY_NUM[+n] = a; });
  const BY_NAME = { Kosovo: 'XK', Somaliland: 'SO', 'N. Cyprus': 'CY' };
  let geo = null;
  function topoFeatures(t) {
    const [sx, sy] = t.transform.scale, [tx, ty] = t.transform.translate;
    const arcs = t.arcs.map(a => { let x = 0, y = 0; return a.map(([dx, dy]) => [(x += dx) * sx + tx, (y += dy) * sy + ty]); });
    const ring = idx => { const pts = []; idx.forEach((k, j) => { const a = k < 0 ? arcs[~k].slice().reverse() : arcs[k]; pts.push(...(j ? a.slice(1) : a)); }); return pts; };
    return t.objects.countries.geometries.map(g => {
      const polys = g.type === 'Polygon' ? [g.arcs.map(ring)] : g.type === 'MultiPolygon' ? g.arcs.map(p => p.map(ring)) : [];
      let x0 = 180, y0 = 90, x1 = -180, y1 = -90;
      polys.forEach(p => p[0].forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }));
      return { code: BY_NUM[+g.id] || BY_NAME[g.properties.name] || '', name: g.properties.name, polys, box: [x0, y0, x1, y1] };
    });
  }
  function inRing(x, y, r) {
    let c = false;
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const [xi, yi] = r[i], [xj, yj] = r[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  }
  async function countryAt(lat, lon, fetchJson) {
    if (!geo) geo = (fetchJson ? fetchJson(GEO_URL) : fetch(GEO_URL).then(r => { if (!r.ok) throw new Error('map'); return r.json(); })).then(topoFeatures).catch(e => { geo = null; throw e; });
    const list = await geo;
    for (const f of list) {
      const [x0, y0, x1, y1] = f.box;
      if (lon < x0 || lon > x1 || lat < y0 || lat > y1) continue;
      if (f.polys.some(p => inRing(lon, lat, p[0]) && !p.slice(1).some(h => inRing(lon, lat, h)))) return { code: f.code, name: f.name, near: false };
    }
    // At sea or on a coast the map is too coarse for: take the closest border within about 30 km
    let best = null, bd = 0.3 * 0.3;
    const k = Math.cos(lat * Math.PI / 180);
    for (const f of list) {
      const [x0, y0, x1, y1] = f.box;
      if (lon < x0 - 0.5 || lon > x1 + 0.5 || lat < y0 - 0.5 || lat > y1 + 0.5) continue;
      for (const p of f.polys) for (const [x, y] of p[0]) { const d = ((x - lon) * k) ** 2 + (y - lat) ** 2; if (d < bd) { bd = d; best = f; } }
    }
    return best ? { code: best.code, name: best.name, near: true } : null;
  }

  // ---------- Which cleaner fits a file ----------
  function kindOf(ext) {
    if (['jpg', 'jpeg', 'jfif'].includes(ext)) return 'jpeg';
    if (['png', 'webp', 'gif', 'svg'].includes(ext)) return ext;
    if (['mp3', 'aac'].includes(ext)) return 'id3';
    if (ext === 'wav') return 'wav';
    if (ext === 'flac') return 'flac';
    if (['mp4', 'm4v', 'mov', 'm4a', '3gp'].includes(ext)) return 'mp4';
    return '';
  }
  // Content decides over the extension: a "jpg" that is really a PNG is still cleaned correctly
  async function sniff(file, ext) {
    const h = await rd(file, 0, 12);
    if (h[0] === 0xFF && h[1] === 0xD8) return 'jpeg';
    if (h[0] === 137 && h[1] === 80 && h[2] === 78) return 'png';
    if (ascii(h, 0, 4) === 'RIFF' && ascii(h, 8, 4) === 'WEBP') return 'webp';
    if (ascii(h, 0, 4) === 'RIFF' && ascii(h, 8, 4) === 'WAVE') return 'wav';
    if (ascii(h, 0, 4) === 'GIF8') return 'gif';
    if (ascii(h, 0, 4) === 'fLaC') return 'flac';
    if (ascii(h, 4, 4) === 'ftyp' && !/^(heic|heix|mif1|msf1|avif|heim|heis|hevc)$/.test(ascii(h, 8, 4))) return 'mp4';
    if (ascii(h, 4, 4) === 'ftyp') return 'heif';
    const k = kindOf(ext);
    return k === 'mp4' || k === 'jpeg' || k === 'png' || k === 'webp' || k === 'gif' ? '' : k;
  }
  async function clean(file, ext, gpsOnly) {
    const k = await sniff(file, ext);
    const buf = () => file.arrayBuffer().then(a => new Uint8Array(a));
    const type = file.type || '';
    switch (k) {
      case 'jpeg': return new Blob([cleanJpeg(await buf(), gpsOnly)], { type: 'image/jpeg' });
      case 'png': return new Blob([cleanPng(await buf(), gpsOnly)], { type: 'image/png' });
      case 'webp': return new Blob([cleanWebp(await buf(), gpsOnly)], { type: 'image/webp' });
      case 'gif': return gpsOnly ? file : new Blob([cleanGif(await buf())], { type: 'image/gif' });
      case 'svg': return gpsOnly ? file : new Blob([cleanSvg(await file.text())], { type: 'image/svg+xml' });
      case 'id3': return gpsOnly ? file : cleanMp3(file);
      case 'wav': return gpsOnly ? file : cleanWav(file);
      case 'flac': return gpsOnly ? file : cleanFlac(file);
      case 'mp4': return cleanMp4(file, gpsOnly);
    }
    void type;
    return null;
  }

  window.FMeta = { sniff, clean, readJpeg, readPng, readWebp, readGif, readSvg, readWav, readMp4, countryAt, orientationOf, tiff, kindOf,
    _test: { cleanJpeg, cleanPng, cleanWebp, cleanGif, cleanSvg, cleanMoov, topoFeatures } };
})();
