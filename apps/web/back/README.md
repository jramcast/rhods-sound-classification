# RHODS Sound Classification Web App Backend

This application is available as a container image:

```
podman run -rm \
-e INFERENCE_ENDPOINT=<rhods_model_url> \
-p 5000:5000 \
quay.io/jramcast/rhods-sound-classification-web-backend
```