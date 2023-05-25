let INFERENCE_BY_URL_ENDPOINT;
let INFERENCE_BY_BLOB_ENDPOINT;


export function setBackendRoute(backend) {
    INFERENCE_BY_URL_ENDPOINT = `${backend}/classify/url`;
    INFERENCE_BY_BLOB_ENDPOINT = `${backend}/classify/blob`;
    console.log(`BACKEND_ENDPOINT_BY_URL: "${INFERENCE_BY_URL_ENDPOINT}"`);
    console.log(`BACKEND_ENDPOINT_BY_BLOB: "${INFERENCE_BY_BLOB_ENDPOINT}"`);
}


export function classifyUrl(url) {

    return fetch(INFERENCE_BY_URL_ENDPOINT, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
    })
    .then(resp => resp.json())
}

export function classifyBlob(blob) {
    const formData = new FormData();
    formData.append("audio", blob);
    return fetch(INFERENCE_BY_BLOB_ENDPOINT, {
        method: "POST",
        body: formData
    })
    .then(resp => resp.json())
}