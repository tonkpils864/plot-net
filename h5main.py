import h5py
import sys
import numpy as np
import json
import os
import tempfile

f = tempfile.NamedTemporaryFile(delete=False)

datal=int(sys.argv[1])
chunkSize=32192

x=0
while (x<datal):
    # print x
    # sys.stdout.flush()
    if ((datal-x)< chunkSize) :
        ret = os.read(3,datal-x)
        f.write(ret)
        break
    else:
        ret = os.read(3,chunkSize)
        f.write(ret)
    x+=chunkSize
os.close(3)
f.close()


with h5py.File(f.name,driver='core',block_size=70000) as hf:
    data=hf.get('dset')
    np_data=np.array(data)

sys.stderr.flush()
d=[]
for i in np_data[0]:
    d.append({"x":i.astype(int),"y":np_data[1][i].astype(int)})
jsonar=json.dumps(d)
print jsonar
sys.stdout.flush()

sys.stderr.flush()

os.unlink(f.name)
