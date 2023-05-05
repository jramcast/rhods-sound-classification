from time import sleep
import numpy as np
import sounddevice as sd
from classification import classify
from librosa.util.exceptions import ParameterError

# def print_sound(indata, outdata, frames, time, status):
#     volume_norm = np.linalg.norm(indata)*10
#     print ("|" * int(volume_norm))

# with sd.Stream(callback=print_sound):
#     sd.sleep(10000)

duration_secs = 10  # seconds
sample_rate = 44100

while True:
    print("Recording...")
    recording = sd.rec(int(duration_secs * sample_rate), samplerate=sample_rate, channels=1, blocking=True)
    recording = np.reshape(recording, recording.shape[0])

    print("Classifying...")
    try:
        class_id, class_name = classify(recording, sample_rate)
        print(f"Class: {class_name} ({class_id})\n------------")
    except ParameterError:
        print("Could not record audio\n------------")

