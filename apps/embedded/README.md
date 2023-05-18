# Audio Classification CLI

Use with a remote file:

```sh
$ ./main.py https://example.com/file.wav
Downloading file...
Classifying...

 * Class: clock_tick (6)
```

Or with a local file:

```sh
$ ./main.py /path/to/file.wav
Loading file...
Classifying...

 * Class: clock_tick (6)
```

## Container Build


First, download the `onnx` model that you previously trained into this directory.

Next, build the container as:

```sh
podman build -t rhods-sound-classification-embedded .
```

Run the container as:

```sh
podman run --rm -ti rhods-sound-classification-embedded https://example.com/file.wav
```

Or map a volume into `/data` to use local files:

```
podman run --rm -ti -v /my/sound/files/dir:/data rhods-sound-classification-embedded /data/file.wav
```
