import { useState, useEffect } from "react";
import { Button, ActionGroup, Page, PageSection, Alert } from '@patternfly/react-core';
import { startWavePlot, clearWavePlot, record } from "../services/audio"
import * as Backend from "../services/backend";

export default function Live({ backendRoute }) {
    const [recordingAllowed, setRecordingAllowed] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState("");
    const [stream, setStream] = useState();
    const [isRecording, setIsRecording] = useState(false);
    const [classificationResult, setClassificationResult] = useState("");

    Backend.setBackendRoute(backendRoute);

    useEffect(() => {
        if(!navigator.mediaDevices) {
            setRecordingAllowed(false);
            setErrorMessage("Media recording devices are only available under HTTPS.");
        } else {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    setRecordingAllowed(true);
                    setStream(stream);
                }).catch(() => {
                    setRecordingAllowed(false);
                    setErrorMessage("Recording not allowed.");
                });
        }

    });

    function start() {
        setIsRecording(true);
        startWavePlot(stream, "audioPlot");
        recordAndClassify();
    }

    function stop() {
        setIsRecording(false);
        clearWavePlot();
    }

    function recordAndClassify() {
        record(stream)
            .then(Backend.classifyBlob)
            .then(result => {
                const message = `Predicted class: ${result.class_name} (${result.class_id})`;
                setClassificationResult(message);
            });

        if (isRecording) {
            setTimeout(() => {
                recordAndClassify(stream);
            }, 3000);
        }
    }

    function renderRecorder() {
        return (
            <>
                <ActionGroup>
                    <Button id="startButton" variant="primary" isDisabled={isRecording} onClick={start}>Start</Button>{' '}
                    <Button id="stopButton" variant="secondary" isDisabled={!isRecording} onClick={stop}>Stop</Button>
                </ActionGroup>
                <canvas id="audioPlot" width="500" height="100"></canvas>
                <div>{classificationResult}</div>
            </>
        )
    }

    function renderAlert(message) {
        return <Alert variant="danger" title={message}></Alert>
    }

    return (
        <Page>
            <PageSection>
                {recordingAllowed === false ? renderAlert(errorMessage) : renderRecorder()}
            </PageSection>
        </Page>
    )
}

// This gets called on every request
export async function getServerSideProps() {
    return { props: { backendRoute: process.env.BACKEND } };
}

