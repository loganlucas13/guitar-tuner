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
    audio = np.array(packet['data'], dtype=np.float32) - 128 / 128
    sampleRate = packet['sampleRate']

    # fourier transform calculations
    fftResult = np.fft.fft(audio)
    magnitudeSpectrum = np.abs(fftResult)

    # we only want to consider positive frequencies
    halfLength = len(magnitudeSpectrum) // 2
    magnitudeSpectrum = magnitudeSpectrum[:halfLength]
    frequencies = np.fft.fftfreq(len(audio), d=1/sampleRate)[:halfLength]

    index = np.argmax(magnitudeSpectrum);
    frequency = frequencies[index]

    closestNote = min(TUNINGS.keys(), key = lambda note: abs(TUNINGS[note] - frequency))
    calculation = abs(TUNINGS[closestNote] - frequency)

    return {
        'closestNote': closestNote,
    }