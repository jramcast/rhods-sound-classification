Build the container:

```
podman build . -t urbansound-rhods-demo-embedded
```

Launch the container as:

```
podman run -ti --rm --device /dev/snd --privileged urbansound-rhods-demo-embedded
```