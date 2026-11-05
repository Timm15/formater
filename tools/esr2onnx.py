"""Real-ESRGAN realesr-general-x4v3 (.pth, SRVGGNetCompact) -> ONNX, without PyTorch.
The .pth is a zip: data.pkl describes tensors, data/<key> holds their raw float32 bytes."""
import sys, zipfile, pickle, collections, numpy as np, onnx
from onnx import helper, TensorProto, numpy_helper

def load_pth(path):
    z = zipfile.ZipFile(path); root = z.namelist()[0].split('/')[0]
    class Storage:  # placeholder for torch.FloatStorage
        pass
    def rebuild(storage, offset, size, stride, *rest):
        key, dtype = storage
        raw = np.frombuffer(z.read(f'{root}/data/{key}'), dtype=dtype)
        n = int(np.prod(size)) if size else 1
        arr = np.lib.stride_tricks.as_strided(raw[offset:], shape=tuple(size), strides=tuple(s * raw.itemsize for s in stride)) if size else raw[offset:offset + 1]
        return np.array(arr, dtype=np.float32).reshape(size)
    class U(pickle.Unpickler):
        def find_class(self, mod, name):
            if name == '_rebuild_tensor_v2': return rebuild
            if name == 'OrderedDict': return collections.OrderedDict
            if name.endswith('Storage'): return {'FloatStorage': np.float32, 'HalfStorage': np.float16}.get(name, np.float32)
            return super().find_class(mod, name)
        def persistent_load(self, pid):  # ('storage', storage_type, key, location, numel)
            return (pid[2], pid[1])
    sd = U(z.open(f'{root}/data.pkl')).load()
    return sd.get('params', sd.get('params_ema', sd))

sd = load_pth(sys.argv[1])
keys = sorted({int(k.split('.')[1]) for k in sd}, )
nodes, inits = [], []
def init(name, arr): inits.append(numpy_helper.from_array(arr.astype(np.float32), name)); return name
x = 'input'; i = 0
while f'body.{i}.weight' in sd:
    w = sd[f'body.{i}.weight']
    if w.ndim == 4:  # convolution 3x3
        out = f'conv{i}'
        nodes.append(helper.make_node('Conv', [x, init(f'w{i}', w), init(f'b{i}', sd[f'body.{i}.bias'])], [out], kernel_shape=[3, 3], pads=[1, 1, 1, 1]))
    else:            # PReLU, one slope per channel
        out = f'act{i}'
        nodes.append(helper.make_node('PRelu', [x, init(f'p{i}', w.reshape(-1, 1, 1))], [out]))
    x = out; i += 1
# pixel shuffle x4 (PyTorch order = DepthToSpace CRD), plus the input enlarged by nearest neighbour
nodes.append(helper.make_node('DepthToSpace', [x], ['up'], blocksize=4, mode='CRD'))
nodes.append(helper.make_node('Resize', ['input', '', init('scales', np.array([1, 1, 4, 4], np.float32))], ['base'], mode='nearest'))
nodes.append(helper.make_node('Add', ['up', 'base'], ['output']))
g = helper.make_graph(nodes, 'realesr-general-x4v3',
    [helper.make_tensor_value_info('input', TensorProto.FLOAT, [1, 3, 'h', 'w'])],
    [helper.make_tensor_value_info('output', TensorProto.FLOAT, [1, 3, 'H', 'W'])], inits)
m = helper.make_model(g, opset_imports=[helper.make_opsetid('', 13)], producer_name='formater')
m.ir_version = 8
onnx.checker.check_model(m)
onnx.save(m, sys.argv[2])
print('layers', i, 'params', sum(int(np.prod(v.shape)) for v in sd.values()))
