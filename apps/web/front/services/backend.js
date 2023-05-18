const INFERENCE_BY_URL_ENDPOINT = process.env.INFERENCE_ENDPOINT || "http://localhost:5000/classify/url"
const INFERENCE_BY_BLOB_ENDPOINT = process.env.INFERENCE_ENDPOINT || "http://localhost:5000/classify/blob"


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