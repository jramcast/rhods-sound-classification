import os
from pathlib import Path
import uuid
from flask import Flask, request, render_template, g
from werkzeug.utils import secure_filename
from flask_cors import CORS
from classification import classify_sound

import requests


app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = ".tmp"

@app.route('/')
def hello(name=None):
    return render_template('index.html', name=name)

@app.route("/classify/blob", methods=["POST"])
def classify_blob():
    g.request_id = str(uuid.uuid4())
    file, full_filename = _get_audio_file()
    file.save(full_filename)

    class_id, class_name = classify_sound(full_filename)

    return {
        "class_id": class_id,
        "class_name": class_name
    }

@app.route("/classify/url", methods=["POST"])
def classify_url():

    file_url = request.json["url"]
    unique_id = str(uuid.uuid4())
    filename = Path(app.config['UPLOAD_FOLDER'], f"download_{unique_id}.wav")

    with requests.get(request.json["url"], allow_redirects=True, stream=True) as response:
        response.raise_for_status()

        with open(filename, "wb") as fp:
            for chunk in response.iter_content(chunk_size=1024 * 10):
                fp.write(chunk)

    class_id, class_name = classify_sound(filename)

    os.remove(filename)

    return {
        "class_id": class_id,
        "class_name": class_name
    }

@app.teardown_request
def clean_up_audio_file(exc):
    # The request contained an audio file
    if "audio" in request.files:
        # Clean up the uploaded audio temp file
        _, full_filename = _get_audio_file()
        os.remove(full_filename)


def _get_audio_file():
    file = request.files["audio"]
    filename = secure_filename(str(file.filename)) + "." + g.request_id
    full_filename = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    return file,full_filename
