#!/usr/bin/env python3

import tempfile
import warnings

import click
import requests
import librosa
from requests.exceptions import RequestException
from librosa.util.exceptions import ParameterError

from classification import classify


warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=UserWarning)

@click.command()
@click.argument("source")
def main(source: str):
    """
    Classify a WAV file.

    SOURCE can be a local file path or a URL
    """
    if source.lower().startswith("http"):
        click.echo("Downloading file...")
        try:
            signal, sample_rate = _load_from_url(source)
        except RequestException:
            click.echo("Could not download file")
            exit(1)
    else:
        click.echo("Loading file...")
        try:
            signal, sample_rate = _load_from_file(source)
        except FileNotFoundError:
            click.echo("File not found")
            exit(1)

    click.echo("Classifying...\n")
    try:
        class_id, class_name = classify(signal, sample_rate)
        click.echo(f" * Class: {class_name} ({class_id})")
    except ParameterError:
        click.echo("Could not classify audio")


def _load_from_url(url: str):
    with tempfile.NamedTemporaryFile(suffix='.zip') as fp:

        with requests.get(url, allow_redirects=True, stream=True) as response:
            response.raise_for_status()

            for chunk in response.iter_content(chunk_size=1024 * 10):
                fp.write(chunk)

        # By default, librosa resamples to 22050 Hz mono
        signal, sample_rate = librosa.load(fp.name)

    return signal, sample_rate

def _load_from_file(path: str):
    signal, sample_rate = librosa.load(path)
    return signal, sample_rate


if __name__ == '__main__':
    main()
