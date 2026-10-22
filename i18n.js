/* Interface languages: the page is written in Russian, this file translates it to English and Chinese.
   D maps a Russian string to [English, Chinese]; RULES handle strings with numbers and file names in them. */
(function () {
  'use strict';
  const D = {
"Максимум": ["Maximum", "最高"],
"считаю, это может занять до минуты": ["calculating, this may take up to a minute", "正在计算，最多可能需要一分钟"],
"«Максимум» качает модель около 90 МБ, а на каждое фото уходит до минуты. Зато края и мелкие детали получаются аккуратнее. Если модель не запустится, сайт сам вернётся к «Точнее».": ["\"Maximum\" downloads a model of about 90 MB, and each photo takes up to a minute. In return the edges and fine details come out neater. If the model can't start, the site falls back to \"More accurate\" by itself.", "“最高”会下载约 90 MB 的模型，每张照片最多需要一分钟。作为回报，边缘和细节更加精细。如果模型无法启动，网站会自动退回到“更精确”。"],
"Без нейросети": ["No neural network", "不用神经网络"],
"Проверить нейросеть": ["Check the neural network", "检查神经网络"],
"Скопировать отчёт": ["Copy report", "复制报告"],
"Если удаление фона не работает, нажмите «Проверить нейросеть» и пришлите скопированный отчёт.": ["If background removal doesn't work, press \"Check the neural network\" and send the copied report.", "如果背景去除无法使用，请点击“检查神经网络”，并发送复制的报告。"],
"Отчёт скопирован": ["Report copied", "报告已复制"],
"Выделите отчёт и скопируйте его вручную": ["Select the report and copy it manually", "请选中报告并手动复制"],
"Нейросеть не запустилась на этом устройстве, поэтому использован простой способ. Он хорошо работает на однотонном фоне.": ["The neural network couldn't start on this device, so a simple method was used. It works well on plain backgrounds.", "此设备无法运行神经网络，因此使用了简单方法。它在纯色背景上效果较好。"],
"простой способ": ["basic method", "简单方法"],
"Не удалось открыть фото: файл повреждён или этот формат не поддерживается браузером.": ["Couldn't open the photo: the file is damaged or this format isn't supported by the browser.", "无法打开照片：文件已损坏，或浏览器不支持此格式。"],
"Конвертирует, сжимает и обрезает фото, видео, аудио, PDF, таблицы и документы. Перетащите файлы, выберите формат и скачайте результат.": [
"Converts, compresses and trims photos, video, audio, PDFs, spreadsheets and documents. Drop your files, pick a format and download the result.",
"在浏览器中转换、压缩和剪辑照片、视频、音频、PDF、表格和文档。拖入文件，选择格式，下载结果。"
],
"Всё работает в браузере, файлы никуда не отправляются": [
"Everything runs in your browser, files are never uploaded",
"一切都在浏览器中运行，文件不会被上传"
],
"Конвертировать": [
"Convert",
"转换"
],
"Сжать": [
"Compress",
"压缩"
],
"Обрезка": [
"Trim",
"剪辑"
],
"Убрать фон": [
"Remove background",
"去除背景"
],
"Перетащите файлы сюда": [
"Drop files here",
"将文件拖到此处"
],
"или нажмите, чтобы выбрать. Можно сразу много, можно вставить картинку через Ctrl+V.": [
"or click to choose. You can add many at once, or paste an image with Ctrl+V.",
"或点击选择。可一次添加多个文件，也可用 Ctrl+V 粘贴图片。"
],
"Очередь": [
"Queue",
"队列"
],
"Все в": [
"All to",
"全部转为"
],
"Добавьте файлы, и они появятся здесь.": [
"Add files and they will appear here.",
"添加文件后会显示在这里。"
],
"Остановить": [
"Stop",
"停止"
],
"Добавить файлы": [
"Add files",
"添加文件"
],
"Очистить": [
"Clear",
"清空"
],
"Готово": [
"Done",
"完成"
],
"Скачать всё ZIP": [
"Download all as ZIP",
"全部打包下载 ZIP"
],
"Подсказки": [
"Tips",
"提示"
],
"Добавьте файлы, и здесь появятся подсказки именно для них. А пока вот что умеет каждый тип.": [
"Add files and tips for exactly those files will appear here. Until then, here is what each type can do.",
"添加文件后，这里会显示针对这些文件的提示。在此之前，先看看每种类型能做什么。"
],
"Фото и картинки": [
"Photos and images",
"照片和图片"
],
"HEIC с iPhone лучше перевести в JPG: он откроется везде.": [
"Convert HEIC from iPhone to JPG: it opens everywhere.",
"iPhone 的 HEIC 建议转为 JPG：任何设备都能打开。"
],
"PNG хранит прозрачность, у JPG её нет: пустые места зальются цветом из настроек.": [
"PNG keeps transparency, JPG doesn't: empty areas are filled with the colour from the settings.",
"PNG 支持透明，JPG 不支持：空白区域会用设置中的颜色填充。"
],
"WEBP легче JPG примерно на треть, он подходит для сайтов.": [
"WEBP is about a third lighter than JPG and works well for websites.",
"WEBP 比 JPG 小约三分之一，适合网站。"
],
"Несколько картинок в PDF соберутся в один документ. Это можно выключить в настройках.": [
"Several images to PDF are put into one document. You can turn this off in the settings.",
"多张图片转 PDF 时会合并成一个文档，可在设置中关闭。"
],
"ICO нужен для значков сайта: картинка вписывается в квадрат до 256 px.": [
"ICO is for website icons: the picture is fitted into a square of up to 256 px.",
"ICO 用于网站图标：图片会适配到不超过 256 px 的正方形。"
],
"Видео": [
"Video",
"视频"
],
"MP4 откроется на любом устройстве. WEBM легче и хорошо работает на сайтах.": [
"MP4 opens on any device. WEBM is lighter and works well on websites.",
"MP4 可在任何设备上打开。WEBM 更小，适合网站。"
],
"Чтобы достать звук из видео, выберите MP3.": [
"To get the sound out of a video, choose MP3.",
"想提取视频中的声音，请选择 MP3。"
],
"GIF делается из первых 30 секунд. Ширину и число кадров выбирайте справа.": [
"GIF is made from the first 30 seconds. Pick the width and frame rate on the right.",
"GIF 由前 30 秒制作。请在右侧选择宽度和帧率。"
],
"Значок с ножницами у файла обрежет начало и конец.": [
"The scissors icon next to a file trims its start and end.",
"文件旁的剪刀图标可裁掉开头和结尾。"
],
"Аудио": [
"Audio",
"音频"
],
"MP3 играет везде. WAV без потерь, но весит в 5–10 раз больше. M4A и OGG дают хорошее качество при малом весе.": [
"MP3 plays everywhere. WAV is lossless but 5–10 times larger. M4A and OGG give good quality at a small size.",
"MP3 到处都能播放。WAV 无损，但体积大 5–10 倍。M4A 和 OGG 体积小、音质好。"
],
"Ножницы справа от файла обрезают начало и конец. Тяните края на волне и слушайте результат до сохранения.": [
"The scissors to the right of a file trim its start and end. Drag the edges on the waveform and listen before saving.",
"文件右侧的剪刀可裁掉开头和结尾。拖动波形上的边缘，保存前可先试听。"
],
"Чтобы только обрезать, оставьте тот же формат: он появится в списке после обрезки.": [
"To only trim, keep the same format: it appears in the list after you trim.",
"如果只是剪辑，请保持原格式：剪辑后它会出现在列表中。"
],
"Каждая страница станет отдельной картинкой.": [
"Each page becomes a separate image.",
"每一页会变成一张单独的图片。"
],
"Если страниц много, оставьте «Авто»: больше 10 картинок упакуются в один ZIP. Или склейте страницы в длинные картинки.": [
"If there are many pages, leave \"Auto\": more than 10 images are packed into one ZIP. Or join the pages into long images.",
"页数很多时请保持“自动”：超过 10 张图片会打包成一个 ZIP。也可以把页面拼成长图。"
],
"Нужна часть документа: впишите страницы, например 1-5, 8, 11-.": [
"Need part of the document: enter the pages, for example 1-5, 8, 11-.",
"只需要文档的一部分：输入页码，例如 1-5, 8, 11-。"
],
"Для больших PDF берите JPG и 96–150 dpi: это быстрее и легче для памяти.": [
"For large PDFs choose JPG and 96–150 dpi: it is faster and lighter on memory.",
"大型 PDF 建议选 JPG 和 96–150 dpi：更快，也更省内存。"
],
"TXT достаёт текст. Сканы без текстового слоя переводите в картинки.": [
"TXT extracts the text. Scans without a text layer should be converted to images.",
"TXT 会提取文字。没有文字层的扫描件请转为图片。"
],
"Таблицы и данные": [
"Spreadsheets and data",
"表格和数据"
],
"Русский Excel открывает CSV с точкой с запятой, это настройка по умолчанию. Для программ и сайтов чаще нужна запятая.": [
"Russian Excel opens CSV with a semicolon, which is the default setting. Programs and websites usually need a comma.",
"俄语版 Excel 用分号打开 CSV，这是默认设置。程序和网站通常需要逗号。"
],
"Если в книге несколько листов, CSV получится по файлу на каждый лист.": [
"If a workbook has several sheets, you get one CSV per sheet.",
"如果工作簿有多个工作表，每个工作表会生成一个 CSV。"
],
"JSON со списком объектов превращается в таблицу.": [
"JSON with a list of objects turns into a table.",
"包含对象列表的 JSON 会变成表格。"
],
"Документы и текст": [
"Documents and text",
"文档和文本"
],
"Word получается из Markdown, HTML и TXT: заголовки, списки, таблицы и ссылки сохраняются.": [
"Word is made from Markdown, HTML and TXT: headings, lists, tables and links are kept.",
"Word 可由 Markdown、HTML 和 TXT 生成：标题、列表、表格和链接都会保留。"
],
"В PDF страницы A4 сохраняются как картинки: вёрстка точная, но текст не выделяется.": [
"In PDF, A4 pages are saved as images: the layout is exact, but the text can't be selected.",
"转为 PDF 时 A4 页面保存为图片：版式准确，但文字无法选中。"
],
"DOCX в HTML или Markdown удобно, чтобы вставить текст на сайт.": [
"DOCX to HTML or Markdown is handy for putting text on a website.",
"DOCX 转 HTML 或 Markdown，方便把文字放到网站上。"
],
"Картинки": [
"Images",
"图片"
],
"Качество JPG и WEBP": [
"JPG and WEBP quality",
"JPG 和 WEBP 质量"
],
"Длинная сторона не больше, px": [
"Longest side no more than, px",
"最长边不超过，px"
],
"Фон вместо прозрачности": [
"Background instead of transparency",
"透明部分的替代背景色"
],
"Фон нужен для JPG, BMP и PDF: у них нет прозрачности.": [
"The background is needed for JPG, BMP and PDF: they have no transparency.",
"JPG、BMP 和 PDF 需要背景色：它们不支持透明。"
],
"PDF из картинок": [
"PDF from images",
"图片转 PDF"
],
"Размер страницы": [
"Page size",
"页面尺寸"
],
"Авто": [
"Auto",
"自动"
],
"Собрать все картинки в один PDF": [
"Combine all images into one PDF",
"把所有图片合并为一个 PDF"
],
"PDF: страницы": [
"PDF: pages",
"PDF：页面"
],
"Какие страницы": [
"Which pages",
"哪些页面"
],
"Склеить страницы в одну длинную картинку": [
"Join pages into one long image",
"把页面拼成一张长图"
],
"Разрешение картинок": [
"Image resolution",
"图片分辨率"
],
"Каждая страница станет отдельной картинкой. Нужна только часть документа: впишите страницы, например 1-5, 8, 11-.": [
"Each page becomes a separate image. Need only part of the document: enter the pages, for example 1-5, 8, 11-.",
"每一页会变成一张单独的图片。只需要文档的一部分：输入页码，例如 1-5, 8, 11-。"
],
"Если файлов получается много": [
"If there are many files",
"文件很多时"
],
"Отдельно": [
"Separately",
"分开"
],
"В один ZIP": [
"In one ZIP",
"打包成一个 ZIP"
],
"Авто: если из одного файла выходит больше 10 файлов, они упаковываются в один ZIP. Так удобно скачивать PDF на сотни страниц.": [
"Auto: if one file produces more than 10 files, they are packed into one ZIP. This makes it easy to download PDFs with hundreds of pages.",
"自动：如果一个文件生成超过 10 个文件，会打包成一个 ZIP。这样下载几百页的 PDF 很方便。"
],
"Видео в GIF": [
"Video to GIF",
"视频转 GIF"
],
"Ширина GIF": [
"GIF width",
"GIF 宽度"
],
"Кадров в секунду": [
"Frames per second",
"每秒帧数"
],
"GIF делается из первых 30 секунд видео.": [
"GIF is made from the first 30 seconds of the video.",
"GIF 由视频的前 30 秒制作。"
],
"Таблицы": [
"Spreadsheets",
"表格"
],
"Разделитель в CSV": [
"CSV separator",
"CSV 分隔符"
],
", запятая": [
", comma",
", 逗号"
],
"Кириллица в CSV сохраняется так, что Excel открывает её без кракозябр.": [
"Cyrillic text in CSV is saved so that Excel opens it without garbled characters.",
"CSV 中的西里尔字母会以 Excel 能正常打开的方式保存，不会出现乱码。"
],
"Документы в PDF": [
"Documents to PDF",
"文档转 PDF"
],
"Страницы A4 сохраняются как изображения: вёрстка и кириллица точно как на экране, но текст в PDF не выделяется.": [
"A4 pages are saved as images: the layout and Cyrillic look exactly as on screen, but the text in the PDF can't be selected.",
"A4 页面保存为图片：版式和西里尔字母与屏幕上完全一致，但 PDF 中的文字无法选中。"
],
"Сила сжатия": [
"Compression strength",
"压缩强度"
],
"Слабо": [
"Light",
"轻度"
],
"Средне": [
"Medium",
"中度"
],
"Сильно": [
"Strong",
"强力"
],
"Разница видна только при сильном увеличении. Фото до 2560 px, видео до 1080p.": [
"The difference is visible only when zoomed in a lot. Photos up to 2560 px, video up to 1080p.",
"只有大幅放大时才能看出差别。照片最大 2560 px，视频最高 1080p。"
],
"Фото": [
"Photos",
"照片"
],
"Формат результата": [
"Result format",
"结果格式"
],
"Как был": [
"As it was",
"保持原样"
],
"Уложить в размер, КБ": [
"Fit into size, KB",
"压缩到大小，KB"
],
"Размер в КБ удобен для форм с лимитом, например «не больше 1 МБ». WEBP обычно легче JPG на треть.": [
"A size in KB is handy for forms with a limit, for example \"no more than 1 MB\". WEBP is usually a third lighter than JPG.",
"KB 大小适用于有限制的表单，例如“不超过 1 MB”。WEBP 通常比 JPG 小三分之一。"
],
"Разрешение": [
"Resolution",
"分辨率"
],
"Убрать звук": [
"Remove sound",
"去掉声音"
],
"Видео пережимается кодеками вашего браузера. Быстрее всего в Chrome и Edge.": [
"Video is re-encoded with your browser's codecs. Fastest in Chrome and Edge.",
"视频使用浏览器的编码器重新编码。在 Chrome 和 Edge 中最快。"
],
"Аудио пересохраняется в MP3 128 кбит/с.": [
"Audio is re-saved as MP3 128 kbps.",
"音频将重新保存为 MP3 128 kbps。"
],
"Удаление фона": [
"Background removal",
"背景去除"
],
"Нейросеть находит главный предмет на фото и делает всё остальное прозрачным. Всё считается в вашем браузере, фото никуда не отправляется.": [
"A neural network finds the main subject in the photo and makes everything else transparent. Everything runs in your browser, the photo is never uploaded.",
"神经网络会找出照片中的主体，并把其余部分变透明。一切都在浏览器中运行，照片不会被上传。"
],
"Модель": [
"Model",
"模型"
],
"Быстро": [
"Fast",
"快速"
],
"Точнее": [
"More accurate",
"更精确"
],
"«Точнее» скачивает модель около 42 МБ один раз: она лучше справляется с руками, волосами и мелкими деталями. «Быстро» весит около 5 МБ, но чаще ошибается. «Без нейросети» работает на любом устройстве, но хорошо вырезает только однотонный фон. Большие фото уменьшаются до 2048 px.": ["\"More accurate\" downloads a model of about 42 MB once: it copes better with hands, hair and fine details. \"Fast\" weighs about 5 MB but makes more mistakes. \"No neural network\" works on any device, but cuts out only a plain background well. Large photos are reduced to 2048 px.", "“更精确”会下载一次约 42 MB 的模型：对手、头发和细节处理得更好。“快速”约 5 MB，但更容易出错。“不用神经网络”在任何设备上都能用，但只能较好地去除纯色背景。大照片会缩小到 2048 px。"],
"Обрезка аудио и видео": [
"Trim audio and video",
"剪辑音频和视频"
],
"Для каждого файла откроется шкала. Тяните края выбранного участка или впишите время, например 1:23.5. Участок можно прослушать до сохранения (у видео играет звук).": [
"Each file gets a timeline. Drag the edges of the selected part or type a time, for example 1:23.5. You can listen to the selection before saving (for video, the sound plays).",
"每个文件会显示时间轴。拖动所选部分的边缘，或输入时间，例如 1:23.5。保存前可试听所选部分（视频会播放声音）。"
],
"Формат результата выбирается справа от файла. По умолчанию остаётся тот же, что был.": [
"The result format is chosen to the right of the file. By default it stays the same as it was.",
"结果格式在文件右侧选择。默认保持原格式。"
],
"Показать все настройки": [
"Show all settings",
"显示全部设置"
],
"Что умеет Formater": [
"What Formater can do",
"Formater 的功能"
],
"Что": [
"What",
"内容"
],
"Форматы": [
"Formats",
"格式"
],
"Во что": [
"To what",
"转换为"
],
"Данные": [
"Data",
"数据"
],
"Веб-страницы": [
"Web pages",
"网页"
],
"Текст": [
"Text",
"文本"
],
"Сжатие": [
"Compression",
"压缩"
],
"Formater · файлы обрабатываются прямо в вашем браузере и никуда не загружаются": [
"Formater · files are processed right in your browser and are never uploaded",
"Formater · 文件直接在浏览器中处理，不会被上传"
],
"Режим": [
"Mode",
"模式"
],
"Настройки": [
"Settings",
"设置"
],
"без изменений": [
"unchanged",
"不变"
],
"все, или например 1-5, 8, 11-": [
"all, or for example 1-5, 8, 11-",
"全部，或例如 1-5, 8, 11-"
],
"Упаковка результата": [
"Packing the result",
"结果打包方式"
],
"не важно": [
"doesn't matter",
"不限"
],
"по силе сжатия": [
"by compression strength",
"按压缩强度"
],
"Formater — конвертер и компрессор файлов онлайн": [
"Formater: online file converter and compressor",
"Formater：在线文件转换和压缩工具"
],
"Бесплатно конвертирует и сжимает фото, видео, аудио, PDF, таблицы и документы прямо в браузере. Файлы никуда не загружаются.": [
"Converts and compresses photos, video, audio, PDFs, spreadsheets and documents for free, right in your browser. Files are never uploaded.",
"免费在浏览器中转换和压缩照片、视频、音频、PDF、表格和文档。文件不会被上传。"
],
"Фото, видео или аудио. Покажем, на сколько уменьшился каждый файл.": [
"Photos, video or audio. We will show how much each file shrank.",
"照片、视频或音频。我们会显示每个文件缩小了多少。"
],
"Добавьте фото, видео или аудио, которые нужно сделать легче.": [
"Add photos, video or audio that you want to make lighter.",
"添加需要减小体积的照片、视频或音频。"
],
"Средняя сила обычно уменьшает фото в 3–5 раз, разницу почти не видно.": [
"Medium strength usually makes a photo 3–5 times smaller, and the difference is barely visible.",
"中度压缩通常能把照片缩小 3–5 倍，几乎看不出差别。"
],
"Для сайта или формы с лимитом задайте размер в КБ: качество подберётся само.": [
"For a website or a form with a limit, set the size in KB: the quality is picked automatically.",
"对于有限制的网站或表单，设置 KB 大小：质量会自动选择。"
],
"WEBP на выходе легче JPG. PNG со скриншотами сжимается уменьшением числа цветов.": [
"WEBP output is lighter than JPG. PNG screenshots shrink by reducing the number of colours.",
"输出 WEBP 比 JPG 更小。PNG 截图通过减少颜色数来压缩。"
],
"Фото для мессенджера: сила «Сильно», сторона до 1600 px.": [
"Photo for a messenger: strength \"Strong\", side up to 1600 px.",
"发给聊天软件的照片：选择“强力”，边长不超过 1600 px。"
],
"Сильнее всего на вес влияет разрешение: 720p вместо 1080p почти вдвое легче.": [
"Resolution affects the size the most: 720p instead of 1080p is almost half the size.",
"分辨率对体积影响最大：720p 比 1080p 小近一半。"
],
"Для мессенджеров ставьте «Сильно», для архива «Слабо».": [
"For messengers choose \"Strong\", for an archive \"Light\".",
"发给聊天软件选“强力”，存档选“轻度”。"
],
"Если звук не нужен, отметьте «Убрать звук».": [
"If you don't need the sound, tick \"Remove sound\".",
"如果不需要声音，请勾选“去掉声音”。"
],
"Лишнее можно отрезать ножницами перед сжатием.": [
"You can cut off the extra parts with the scissors before compressing.",
"压缩前可以用剪刀剪掉多余部分。"
],
"Звук сохраняется в MP3. Речи и подкастам хватит «Сильно» (96 кбит/с), музыке «Средне» (128).": [
"Sound is saved as MP3. \"Strong\" (96 kbps) is enough for speech and podcasts, \"Medium\" (128) for music.",
"声音保存为 MP3。语音和播客用“强力”（96 kbps）就够了，音乐用“中度”（128）。"
],
"WAV сжимается особенно сильно: MP3 легче его в 5–10 раз.": [
"WAV shrinks especially well: MP3 is 5–10 times lighter.",
"WAV 压缩效果特别好：MP3 小 5–10 倍。"
],
"Ножницами можно убрать тишину в начале и конце.": [
"With the scissors you can cut silence from the start and end.",
"用剪刀可以去掉开头和结尾的静音。"
],
"PDF пока не сжимается. Его можно перевести в картинки на вкладке «Конвертировать», а картинки сжать здесь.": [
"PDF can't be compressed yet. You can convert it to images on the \"Convert\" tab and compress the images here.",
"PDF 暂时不能压缩。可以在“转换”标签页把它转成图片，再在这里压缩图片。"
],
"Таблицы не сжимаются: они и так лёгкие.": [
"Spreadsheets are not compressed: they are light already.",
"表格不需要压缩：它们本来就很小。"
],
"Документы не сжимаются: они и так лёгкие.": [
"Documents are not compressed: they are light already.",
"文档不需要压缩：它们本来就很小。"
],
"Перетащите аудио или видео сюда": [
"Drop audio or video here",
"将音频或视频拖到此处"
],
"или нажмите, чтобы выбрать. MP3, WAV, M4A, MP4, MOV, WEBM и другие.": [
"or click to choose. MP3, WAV, M4A, MP4, MOV, WEBM and others.",
"或点击选择。支持 MP3、WAV、M4A、MP4、MOV、WEBM 等。"
],
"Добавьте аудио или видео, которое нужно обрезать.": [
"Add audio or video that you want to trim.",
"添加需要剪辑的音频或视频。"
],
"Обрезать": [
"Trim",
"剪辑"
],
"Видео пережимается заново, поэтому обрезка занимает время, зависящее от длины ролика.": [
"Video is re-encoded, so trimming takes time that depends on the clip length.",
"视频会被重新编码，所以剪辑所需时间取决于视频长度。"
],
"Оставьте тот же формат, если нужен тот же ролик, только короче. MP4 откроется везде.": [
"Keep the same format if you want the same clip, just shorter. MP4 opens everywhere.",
"如果想要同样的视频只是更短，请保持相同格式。MP4 在任何地方都能打开。"
],
"Прослушать можно только звук. Нужный момент проще найти по звуку и времени.": [
"You can only listen to the sound. It is easier to find the right moment by sound and time.",
"只能试听声音。通过声音和时间更容易找到准确位置。"
],
"Двигайте левый и правый край на волне: сохранится только светлая часть.": [
"Move the left and right edges on the waveform: only the bright part is kept.",
"拖动波形上的左右边缘：只保留高亮部分。"
],
"Кнопка «Прослушать» играет выбранный участок, так легко поймать нужную секунду.": [
"The \"Listen\" button plays the selected part, so it is easy to catch the right second.",
"“试听”按钮会播放所选部分，方便找准那一秒。"
],
"Чтобы не терять качество, оставьте тот же формат. Нужен другой, например MP3 для телефона, выберите его справа от файла.": [
"To keep the quality, keep the same format. If you need another one, for example MP3 for a phone, choose it to the right of the file.",
"为避免损失质量，请保持相同格式。需要其他格式（例如手机用的 MP3），请在文件右侧选择。"
],
"Файлов можно добавить сразу несколько: каждый обрежется по своему участку.": [
"You can add several files at once: each is trimmed by its own selection.",
"可以一次添加多个文件：每个文件按各自的选择剪辑。"
],
"Перетащите фото сюда": [
"Drop photos here",
"将照片拖到此处"
],
"или нажмите, чтобы выбрать. Результат будет PNG с прозрачным фоном.": [
"or click to choose. The result is a PNG with a transparent background.",
"或点击选择。结果是透明背景的 PNG。"
],
"Добавьте фото, у которых нужно убрать фон.": [
"Add photos whose background you want to remove.",
"添加需要去除背景的照片。"
],
"Лучше всего работают фото, где главный предмет чётко виден: человек, животное, вещь на столе.": [
"Works best on photos where the main subject is clearly visible: a person, an animal, an object on a table.",
"主体清晰可见的照片效果最好：人物、动物、桌上的物品。"
],
"Результат сохраняется в PNG: только он умеет хранить прозрачность. JPG прозрачность теряет.": [
"The result is saved as PNG: only it can store transparency. JPG loses transparency.",
"结果保存为 PNG：只有它能保存透明。JPG 会丢失透明。"
],
"Мелкие детали вроде волос и шерсти могут получиться неидеально. Это ограничение лёгкой модели, которая работает прямо в браузере.": [
"Fine details such as hair and fur may come out imperfect. This is a limit of the light model that runs right in the browser.",
"头发和毛发等细节可能不够完美。这是直接在浏览器中运行的轻量模型的局限。"
],
"Чтобы залить фон цветом, откройте PNG в любом редакторе или переведите его в JPG на вкладке «Конвертировать»: фон возьмётся из настроек.": [
"To fill the background with a colour, open the PNG in any editor or convert it to JPG on the \"Convert\" tab: the background comes from the settings.",
"想用颜色填充背景：用任意编辑器打开 PNG，或在“转换”标签页转为 JPG：背景色取自设置。"
],
"Не удалось загрузить модуль конвертера. Проверьте интернет и попробуйте ещё раз.": [
"Couldn't load the converter module. Check your internet connection and try again.",
"无法加载转换模块。请检查网络后重试。"
],
"SVG уже векторный, сжимать нечего": [
"SVG is already vector, there is nothing to compress",
"SVG 已是矢量图，无需压缩"
],
"PDF пока не сжимается": [
"PDF can't be compressed yet",
"PDF 暂时不能压缩"
],
"Документы и таблицы не сжимаются": [
"Documents and spreadsheets are not compressed",
"文档和表格不能压缩"
],
"Этот формат пока не поддерживается": [
"This format is not supported yet",
"暂不支持此格式"
],
"Браузер не смог сохранить картинку.": [
"The browser couldn't save the image.",
"浏览器无法保存图片。"
],
"Остановлено": [
"Stopped",
"已停止"
],
"Почти без потери качества. Фото не уменьшаются в размерах.": [
"Almost no loss of quality. Photos are not reduced in size.",
"几乎不损失质量。照片尺寸不会缩小。"
],
"Максимально лёгкие файлы для мессенджеров и почты. Фото до 1600 px, видео до 720p.": [
"The lightest files for messengers and email. Photos up to 1600 px, video up to 720p.",
"为聊天软件和邮件提供最小的文件。照片最大 1600 px，视频最高 720p。"
],
"Выберите фото": [
"Choose photos",
"选择照片"
],
"Выберите аудио или видео": [
"Choose audio or video",
"选择音频或视频"
],
"Выберите файлы": [
"Choose files",
"选择文件"
],
"Нажмите и выберите фото человека, предмета или животного. Результат будет PNG с прозрачным фоном.": [
"Tap and choose a photo of a person, object or animal. The result will be a PNG with a transparent background.",
"点击并选择人物、物品或动物的照片。结果是透明背景的 PNG。"
],
"Нажмите и выберите песню, запись, голосовое сообщение или ролик.": [
"Tap and choose a song, recording, voice message or clip.",
"点击并选择歌曲、录音、语音消息或视频片段。"
],
"Нажмите, чтобы выбрать фото, видео или документы. Можно сразу несколько.": [
"Tap to choose photos, video or documents. You can pick several at once.",
"点击选择照片、视频或文档。可一次选多个。"
],
"Нажмите и выберите фото, видео или аудио. Покажем, на сколько уменьшился каждый файл.": [
"Tap and choose photos, video or audio. We will show how much each file shrank.",
"点击并选择照片、视频或音频。我们会显示每个文件缩小了多少。"
],
"Большое видео: на телефоне может не хватить памяти. Для таких файлов лучше компьютер.": [
"Large video: a phone may not have enough memory. A computer is better for such files.",
"大视频：手机内存可能不够。这类文件最好用电脑处理。"
],
"В этой вкладке только аудио и видео": [
"Only audio and video in this tab",
"此标签页仅支持音频和视频"
],
"В этой вкладке только фото": [
"Only photos in this tab",
"此标签页仅支持照片"
],
"Для других типов файлов": [
"For other file types",
"其他文件类型"
],
"Скрыть лишние настройки": [
"Hide extra settings",
"隐藏多余设置"
],
"упаковываю в ZIP": [
"packing into ZIP",
"正在打包 ZIP"
],
"Загружаю звук…": [
"Loading sound…",
"正在加载声音…"
],
"Не удалось определить длительность файла.": [
"Couldn't determine the file duration.",
"无法确定文件时长。"
],
"Волну показать не получилось, но обрезать по времени можно.": [
"Couldn't show the waveform, but you can still trim by time.",
"无法显示波形，但仍可按时间剪辑。"
],
"Начало, минуты:секунды": [
"Start, minutes:seconds",
"开始，分:秒"
],
"Конец, минуты:секунды": [
"End, minutes:seconds",
"结束，分:秒"
],
"▶ Прослушать": [
"▶ Listen",
"▶ 试听"
],
"■ Стоп": [
"■ Stop",
"■ 停止"
],
"Браузер не смог воспроизвести этот файл.": [
"The browser couldn't play this file.",
"浏览器无法播放此文件。"
],
"Не закрывайте вкладку и не сворачивайте браузер, пока идёт обработка.": [
"Don't close the tab or minimise the browser while processing is running.",
"处理期间请勿关闭标签页或最小化浏览器。"
],
"Видео на телефоне обрабатывается медленнее и может не поместиться в память. Большие ролики лучше делать на компьютере.": [
"Video on a phone is processed more slowly and may not fit in memory. Large clips are better done on a computer.",
"手机上处理视频较慢，可能内存不足。较大的视频最好用电脑处理。"
],
"Время вводите так: 1:23.5 или 83": [
"Enter time like this: 1:23.5 or 83",
"请这样输入时间：1:23.5 或 83"
],
"Добавлено из буфера обмена": [
"Added from the clipboard",
"已从剪贴板添加"
],
"Не удалось прочитать TIFF.": [
"Couldn't read the TIFF.",
"无法读取 TIFF。"
],
"Не удалось прочитать картинку. Файл повреждён или браузер не знает этот формат.": [
"Couldn't read the image. The file is damaged or the browser doesn't know this format.",
"无法读取图片。文件已损坏，或浏览器不支持此格式。"
],
"Неизвестный формат": [
"Unknown format",
"未知格式"
],
"Браузер не умеет читать кодек этого файла. Откройте страницу в Chrome или Edge, они знают больше кодеков.": [
"The browser can't read this file's codec. Open the page in Chrome or Edge, they know more codecs.",
"浏览器无法读取此文件的编码。请用 Chrome 或 Edge 打开此页面，它们支持更多编码。"
],
"Браузер не умеет кодировать в этот формат. Попробуйте другой формат или Chrome и Edge.": [
"The browser can't encode to this format. Try another format, or Chrome and Edge.",
"浏览器无法编码为此格式。请尝试其他格式，或使用 Chrome 和 Edge。"
],
"Не удалось прочитать файл: формат не распознан или файл повреждён.": [
"Couldn't read the file: the format is not recognised or the file is damaged.",
"无法读取文件：格式无法识别或文件已损坏。"
],
"В этом видео нет звуковой дорожки.": [
"This video has no audio track.",
"此视频没有音轨。"
],
"В файле нет видеодорожки.": [
"The file has no video track.",
"文件中没有视频轨道。"
],
"Этот файл не получается перевести в такой формат.": [
"This file can't be converted to that format.",
"此文件无法转换为该格式。"
],
"Этот браузер не умеет работать с видео. На iPhone нужна iOS 16.4 или новее, на Android используйте Chrome.": [
"This browser can't work with video. On iPhone you need iOS 16.4 or newer, on Android use Chrome.",
"此浏览器无法处理视频。iPhone 需要 iOS 16.4 或更高版本，Android 请使用 Chrome。"
],
"Браузер не умеет читать кодек этого видео. Откройте страницу в Chrome или Edge.": [
"The browser can't read this video's codec. Open the page in Chrome or Edge.",
"浏览器无法读取此视频的编码。请用 Chrome 或 Edge 打开此页面。"
],
"В PDF нет текстового слоя (похоже на скан). Сохраните его в PNG или JPG.": [
"The PDF has no text layer (it looks like a scan). Save it as PNG or JPG.",
"PDF 没有文字层（看起来是扫描件）。请另存为 PNG 或 JPG。"
],
"Не удалось загрузить модель удаления фона. Проверьте интернет и попробуйте ещё раз.": [
"Couldn't load the background removal model. Check your internet connection and try again.",
"无法加载背景去除模型。请检查网络后重试。"
],
"загружаю модель": [
"loading model",
"正在加载模型"
],
"подбираю размер": [
"choosing size",
"正在选择大小"
],
"Файл защищён паролем.": [
"The file is password protected.",
"文件有密码保护。"
],
"В JSON ошибка, его не удалось прочитать.": [
"There is an error in the JSON, it couldn't be read.",
"JSON 有错误，无法读取。"
],
"Не хватило памяти. Попробуйте файл поменьше или закройте другие вкладки.": [
"Not enough memory. Try a smaller file or close other tabs.",
"内存不足。请尝试更小的文件，或关闭其他标签页。"
],
"Не получилось: файл повреждён или в необычном формате.": [
"Failed: the file is damaged or in an unusual format.",
"失败：文件已损坏或格式特殊。"
],
"собираю PDF": [
"building PDF",
"正在生成 PDF"
],
"в общем PDF": [
"in the combined PDF",
"在合并的 PDF 中"
],
"Сначала выберите участок: потяните края на волне или впишите время.": [
"First select a part: drag the edges on the waveform or type a time.",
"请先选择一段：拖动波形上的边缘或输入时间。"
],
"Файл уже сжат, сильнее не получается. Попробуйте силу «Сильно».": [
"The file is already compressed, it can't be made smaller. Try the \"Strong\" strength.",
"文件已经压缩过，无法再缩小。请尝试“强力”。"
],
"Готовлю ZIP…": [
"Preparing ZIP…",
"正在准备 ZIP…"
],
"скачается в ZIP": [
"will download in a ZIP",
"将以 ZIP 下载"
],
"Убрать из списка": [
"Remove from list",
"从列表中移除"
],
"Окно сохранения уже открыто. Подтвердите его или закройте.": [
"The save window is already open. Confirm it or close it.",
"保存窗口已打开。请确认或关闭它。"
],
"Файл слишком большой для сохранения отсюда.": [
"The file is too large to save from here.",
"文件太大，无法从这里保存。"
],
"Здесь этот тип файла скачать нельзя. Попробуйте «Скачать всё ZIP».": [
"This file type can't be downloaded here. Try \"Download all as ZIP\".",
"此类型的文件无法在这里下载。请尝试“全部打包下载 ZIP”。"
],
"Не удалось сохранить файл.": [
"Couldn't save the file.",
"无法保存文件。"
],
"сжать в": [
"compress to",
"压缩为"
],
"От": [
"From",
"从"
],
"До": [
"To",
"到"
],
"Сбросить": [
"Reset",
"重置"
],
"Тяните края выбранного участка на волне или впишите время, например 1:23.5. Чтобы только обрезать, оставьте тот же формат.": [
"Drag the edges of the selected part on the waveform or type a time, for example 1:23.5. To only trim, keep the same format.",
"拖动波形上所选部分的边缘，或输入时间，例如 1:23.5。如果只是剪辑，请保持相同格式。"
],
"Скачать": [
"Download",
"下载"
],
"Обрабатываю": [
"Processing",
"处理中"
],
"убрать фон, сохранить в": [
"remove background, save as",
"去除背景，保存为"
],
"Остановлено. Готово": [
"Stopped. Done",
"已停止。完成"
],
"-без-фона": [
"-no-background",
"-无背景"
],
"(обрезка)": [
"(trimmed)",
"（已剪辑）"
],
"картинки": [
"images",
"图片"
],
"-все-страницы": [
"-all-pages",
"-全部页面"
],
"-часть": [
"-part",
"-部分"
],
"-стр": [
"-page",
"-页"
],
"вставка": [
"paste",
"粘贴"
]
};
  const LANGS = ['ru', 'en', 'zh'];
  const files = (n, L) => L === 1 ? n + (+n === 1 ? ' file' : ' files') : n + ' 个文件';
  const pages = (n, L) => L === 1 ? n + (+n === 1 ? ' page' : ' pages') : n + ' 页';
  // [regex, (match, L, T) => text]; L is 1 for English and 2 for Chinese, T translates a nested piece
  const RULES = [
    [/^(\d+) (?:файл|файла|файлов)$/, (m, L) => files(m[1], L)],
    [/^Остановлено\. Готово: (\d+) (?:файл|файла|файлов)$/, (m, L) => (L === 1 ? 'Stopped. Done: ' : '已停止。完成：') + files(m[1], L)],
    [/^Готово: (.+)$/, (m, L, T) => (L === 1 ? 'Done: ' : '完成：') + T(m[1])],
    [/^Осталось (.+)$/, (m, L) => (L === 1 ? 'Left: ' : '剩余 ') + m[1]],
    [/^Выбрано (.+) из (.+)$/, (m, L) => L === 1 ? `Selected ${m[1]} of ${m[2]}` : `已选 ${m[1]}，共 ${m[2]}`],
    [/^Примерно (.+) вместо (.+?)(?: \((.+)\))?$/, (m, L) => L === 1 ? `About ${m[1]} instead of ${m[2]}${m[3] ? ` (${m[3]})` : ''}` : `约 ${m[1]}，原为 ${m[2]}${m[3] ? `（${m[3]}）` : ''}`],
    [/^(\d+) стр\.$/, (m, L) => pages(m[1], L)],
    [/^вёрстка: (\d+) стр\.$/, (m, L) => L === 1 ? `layout: ${pages(m[1], L)}` : `排版：${pages(m[1], L)}`],
    [/^В PDF (\d+) стр\. Для такого объёма берите JPG и 96–150 dpi, а результат упакуется в один ZIP\. Нужна только часть: впишите страницы\.$/,
      (m, L) => L === 1 ? `The PDF has ${pages(m[1], L)}. For this size choose JPG and 96–150 dpi, and the result will be packed into one ZIP. Need only part: enter the pages.`
        : `PDF 共 ${m[1]} 页。这么大的文件建议选 JPG 和 96–150 dpi，结果会打包成一个 ZIP。只需要一部分：请输入页码。`],
    [/^В PDF (\d+) стр\., а выбранных страниц в нём нет\.$/, (m, L) => L === 1 ? `The PDF has ${pages(m[1], L)}, and none of the selected pages are in it.` : `PDF 共 ${m[1]} 页，其中没有所选页面。`],
    [/^Не понял страницы «(.+)»\. Пример: 1-5, 8, 11-$/, (m, L) => L === 1 ? `Couldn't understand the pages "${m[1]}". Example: 1-5, 8, 11-` : `无法识别页码“${m[1]}”。示例：1-5, 8, 11-`],
    [/^(\d+) (?:файл|файла|файлов) нельзя перевести в (.+), их формат не изменился\.$/, (m, L) => L === 1 ? `${files(m[1], L)} can't be converted to ${m[2]}, their format is unchanged.` : `${m[1]} 个文件无法转换为 ${m[2]}，格式保持不变。`],
    [/^кадр (\d+) из (\d+)$/, (m, L) => L === 1 ? `frame ${m[1]} of ${m[2]}` : `第 ${m[1]} 帧，共 ${m[2]} 帧`],
    [/^страница (\d+) из (\d+)$/, (m, L) => L === 1 ? `page ${m[1]} of ${m[2]}` : `第 ${m[1]} 页，共 ${m[2]} 页`],
    [/^загружаю модель (\d+)%$/, (m, L) => L === 1 ? `loading model ${m[1]}%` : `正在加载模型 ${m[1]}%`],
    [/^Очень большая картинка уменьшена до (\d+) млн пикселей: больше этому устройству не потянуть\.$/, (m, L) => L === 1 ? `A very large image was reduced to ${m[1]} megapixels: this device can't handle more.` : `图片过大，已缩小到 ${m[1]} 百万像素：此设备无法处理更大的图片。`],
    [/^Этот браузер не умеет сохранять (.+)\. Попробуйте Chrome, Edge или Firefox\.$/, (m, L) => L === 1 ? `This browser can't save ${m[1]}. Try Chrome, Edge or Firefox.` : `此浏览器无法保存 ${m[1]}。请尝试 Chrome、Edge 或 Firefox。`],
    [/^(\d+) (?:файл|файла|файлов) в одном ZIP$/, (m, L) => L === 1 ? `${files(m[1], L)} in one ZIP` : `${m[1]} 个文件在一个 ZIP 中`],
    [/^(.+), в (\d+) КБ не влезло$/, (m, L, T) => T(m[1]) + (L === 1 ? `, didn't fit into ${m[2]} KB` : `，未能压缩到 ${m[2]} KB`)],
    [/^Обрезать (.+)$/, (m, L) => (L === 1 ? 'Trim ' : '剪辑 ') + m[1]],
    [/^Убрать (.+) из списка$/, (m, L) => L === 1 ? `Remove ${m[1]} from the list` : `从列表中移除 ${m[1]}`],
    [/^Убрать (.+)$/, (m, L) => (L === 1 ? 'Remove ' : '移除 ') + m[1]],
    [/^Формат для (.+)$/, (m, L) => (L === 1 ? 'Format for ' : '格式：') + m[1]],
    [/^Не удалось убрать фон: (.+)$/, (m, L) => (L === 1 ? "Couldn't remove the background: " : '无法去除背景：') + m[1]],
    [/^Аудио пересохраняется в MP3 (\d+) кбит\/с\.$/, (m, L) => L === 1 ? `Audio is re-saved as MP3 ${m[1]} kbps.` : `音频将重新保存为 MP3 ${m[1]} kbps。`],
  ];
  const UNITS = { 'Б': 'B', 'КБ': 'KB', 'МБ': 'MB', 'ГБ': 'GB' };
  const units = s => s.replace(/(\d+)(?:,(\d+))? (КБ|МБ|ГБ|Б)(?![А-Яа-яЁё])/g, (m, a, b, u) => a + (b ? '.' + b : '') + ' ' + UNITS[u]);
  const CYR = /[А-Яа-яЁё]/;

  function tr(s, L) {
    if (L === 0) return s;
    const hit = D[s];
    if (hit) return hit[L - 1];
    for (const [re, f] of RULES) {
      const m = re.exec(s);
      if (m) return units(f(m, L, x => tr(x, L)));
    }
    return units(s);
  }

  let lang = 0;
  function detect() {
    try { const v = localStorage.getItem('formater-lang'); if (LANGS.includes(v)) return LANGS.indexOf(v); } catch {}
    for (const l of navigator.languages || [navigator.language || 'en']) {
      const c = String(l).toLowerCase();
      if (/^(ru|uk|be|kk)/.test(c)) return 0;
      if (c.startsWith('zh')) return 2;
      if (c.startsWith('en')) return 1;
    }
    return 1;
  }

  // What each text node or attribute said in Russian, so a switch of language can start from the original
  const saved = new WeakMap();
  const ATTRS = ['title', 'aria-label', 'placeholder', 'alt'];
  function skip(el) { return !el || el.closest('script,style,.name,.diag'); }
  function render(ru) {
    const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(ru);
    return m[1] + tr(m[2].replace(/\s+/g, ' '), lang) + m[3];
  }
  function text(n) {
    if (skip(n.parentElement)) return;
    const s = saved.get(n), ru = s && n.nodeValue === s.out ? s.ru : n.nodeValue;
    if (!CYR.test(ru)) { if (s) saved.delete(n); return; }
    const out = render(ru);
    if (out !== n.nodeValue) n.nodeValue = out;
    saved.set(n, { ru, out });
  }
  function attr(el, name) {
    if (skip(el)) return;
    const v = el.getAttribute(name); if (v == null) return;
    let map = saved.get(el); if (!map) saved.set(el, map = {});
    const s = map[name], ru = s && v === s.out ? s.ru : v;
    if (!CYR.test(ru)) { delete map[name]; return; }
    const out = render(ru);
    if (out !== v) el.setAttribute(name, out);
    map[name] = { ru, out };
  }
  function walk(root) {
    if (root.nodeType === 3) return text(root);
    if (root.nodeType !== 1) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let n = root;
    do {
      if (n.nodeType === 3) text(n); else for (const a of ATTRS) if (n.hasAttribute && n.hasAttribute(a)) attr(n, a);
    } while ((n = w.nextNode()));
  }

  const head = { title: document.title, desc: (document.querySelector('meta[name="description"]') || {}).content };
  function setLang(i) {
    lang = i;
    try { localStorage.setItem('formater-lang', LANGS[i]); } catch {}
    document.documentElement.lang = LANGS[i];
    document.title = render(head.title);
    const meta = document.querySelector('meta[name="description"]');
    if (meta && head.desc) meta.setAttribute('content', render(head.desc));
    walk(document.body);
    document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === LANGS[i])));
  }

  window.I18N = {
    get lang() { return LANGS[lang]; },
    // Words that end up in file names
    w: k => (D[k] && lang ? D[k][lang - 1] : k),
    tr: s => tr(s, lang),
  };

  lang = detect();
  setLang(lang);
  document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => setLang(LANGS.indexOf(b.dataset.lang))));
  new MutationObserver(list => {
    for (const r of list) {
      if (r.type === 'childList') r.addedNodes.forEach(walk);
      else if (r.type === 'characterData') text(r.target);
      else if (r.type === 'attributes') attr(r.target, r.attributeName);
    }
  }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
})();
