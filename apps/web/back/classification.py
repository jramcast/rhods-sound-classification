import os
import sys
from pathlib import Path
import librosa
import logging
import requests
import warnings
import numpy as np
import preprocessing


# Hide Librosa warnings
warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=UserWarning)


logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

CLASSES = [
    'dog',
    'chainsaw',
    'crackling_fire',
    'helicopter',
    'rain',
    'crying_baby',
    'clock_tick',
    'sneezing',
    'rooster',
    'sea_waves'
]

INFERENCE_ENDPOINT = os.getenv(
    "INFERENCE_ENDPOINT",
    "https://soundclassifier-jairamir-sounds-rhods.apps.tools-na100.dev.ole.redhat.com/v2/models/soundclassifier/infer"
)


def classify_sound(full_filename: os.PathLike):
    """
    Invoke the machine learning algorithm to classify a sound
    """

    signal, sample_rate = librosa.load(full_filename)

    if _sound_is_too_low(signal):
        return -1, ""

    mels = preprocessing.wav_to_mels(signal, sample_rate)

    payload = {
        "inputs": [
            {
                # The ONNX model requires this name
                "name": "mels",
                "shape": [1, 128],
                "datatype": "FP32",
                "data": [mels.tolist()]
            }
        ]
    }

    # about how to run inference
    # https://github.com/kserve/modelmesh-serving/blob/main/docs/predictors/run-inference.md#inference-using-rest
    response = requests.post(INFERENCE_ENDPOINT, json=payload)
    result =  response.json()
    print("RESULT", result)
    class_id = np.argmax(result["outputs"][0]["data"])
    class_name = CLASSES[class_id]
    return int(class_id) ,class_name


def _sound_is_too_low(signal):
    db = librosa.amplitude_to_db(signal)
    max_db = max(db)
    if max_db < -30:
        logger.warning(f"Signal too low ({max_db}). Omitting...")
        return True

    return False