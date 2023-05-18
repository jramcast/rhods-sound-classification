let drawInterval;
const CLIP_SECONDS = 4;

/**
 * Record an audio stream
 * @param {MediaStream} stream
 * @returns Promise that resolves to a blob
 */
export function record(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => {
            chunks.push(e.data);
        };
        recorder.onstop = (e) => {
            const blob = toBlob(chunks, recorder.mimeType);
            resolve(blob);
        }
        setTimeout(() => recorder.stop(), CLIP_SECONDS * 1000)
        recorder.start();
    });
}

function toBlob(chunks, type) {
    const audioBlob = new Blob(chunks, { type });
    const audioUrl = URL.createObjectURL(audioBlob, "audio");
    console.log("New clip recorded:", audioUrl);
    return audioBlob;
}

/**
 * Start plotting a live stream of audio in a canvas
 * @param {MediaStream} stream
 * @param {string} canvasId
 */
export function startWavePlot(stream, canvasId) {
    const canvas = document.getElementById(canvasId);
    const canvasCtx = canvas.getContext("2d");

    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;

    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "red";
    canvasCtx.beginPath();

    const sliceWidth = canvas.width * 7.0 / bufferLength;
    drawInterval = setInterval(function () {
        let x = 0;
        analyser.getByteTimeDomainData(dataArray);
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        canvasCtx.beginPath();
        let sliceIndex = 0;
        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * canvas.height / 2;
            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }
            x += sliceWidth;
            sliceIndex++;
            if (sliceIndex >= Math.floor(5000 / 30)) { // update every 30ms
                break;
            }
        }
        canvasCtx.lineTo(canvas.width, canvas.height / 2)
        canvasCtx.stroke();
    }, 30);

    return drawInterval;
}

/**
 * Stop plotting
 * @param {MediaStream} stream
 * @param {string} canvasId
 */
export function clearWavePlot() {
    clearInterval(drawInterval);
}