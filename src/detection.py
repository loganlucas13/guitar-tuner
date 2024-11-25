# guitar tuning application

# developed by Logan Lucas

import numpy as np;

# based off of standard tuning
TUNINGS = {
    'E2': 82.41, 'A2': 110.00, 'D3': 146.83,
    'G3': 196.00, 'B3': 246.94, 'E4': 329.63
}

# takes packet in as input, parses, and performs all calculations
def analyzeData(packet):
    audio = np.array(packet['data'], dtype=np.float32)
    sampleRate = packet['sampleRate']

    return