import numpy as np
import onnxruntime as rt
from preprocessing import wav_to_mels


def get_class_label_by_id(id):
    classes = [
        "air_conditioner",
        "car_horn",
        "children_playing",
        "dog_bark",
        "drilling",
        "engine_idling",
        "gun_shot",
        "jackhammer",
        "siren",
        "street_music"
    ]
    return classes[id]


onnx_filename = "urban_sounds_model_classifier.onnx"

sess = rt.InferenceSession(
    onnx_filename,
    providers=["CPUExecutionProvider"])

def classify(signal, sample_rate):
    input_name = sess.get_inputs()[0].name
    label_name = sess.get_outputs()[0].name
    mels = wav_to_mels(signal, sample_rate)

    input_data = np.array([mels]).astype(np.float32)

    pred_onx = sess.run([label_name], {input_name: input_data})[0]

    predicted_class_idx = np.argmax(pred_onx)

    class_id = predicted_class_idx
    class_name = get_class_label_by_id(predicted_class_idx)

    return class_id, class_name