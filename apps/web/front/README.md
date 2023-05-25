# Sound Classification Web Application Front End

Start the development server:

```
npm run dev
```

Build for production:

```
npm run build
```

Run the built app in production mode:

```
npm start
```

## Container image

This application is available as a container image:

```
podman run --rm \
-p 3000:3000 \
-e BACKEND=www.example.com
quay.io/jramcast/rhods-sound-classification-web-frontend
```
