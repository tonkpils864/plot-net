#
# This example writes data to the existing empty dataset created by h5_crtdat.py and then reads it back.
#
import h5py
import numpy as np
import random
#
# Open an existing file using default properties.
#
file=h5py.File('six.h5','w')
dataset = file.create_dataset("dset",(2,2000000), h5py.h5t.STD_I32BE)
#
# Initialize data object with 0.
#
xdata = range(2000000)
ydata = np.zeros(2000000)

#
# Assign new values
#
for x in xdata:
    ydata[x]= random.randint(1,256)

print xdata
print ydata

#
# Write data
#
print "Writing data..."
dataset[0] = xdata
dataset[1] = ydata

file.close()
