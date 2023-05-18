import librosa
import numpy as np


def wav_to_mels(signal, sample_rate):
    """
    Takes a wav signal and produces the MEL spectrogram data, required by the model as input
    """
    mels = np.mean(librosa.feature.melspectrogram(y = signal, sr = sample_rate), axis=1)
    return mels
