import { useState } from "react";
import {  TextInput, Form,  Text, Button, TextVariants, TextContent, FormGroup, Page, PageSection } from '@patternfly/react-core';
import * as Backend from "../services/backend";

export default function Home( { backendRoute }) {
    const [value, setValue] = useState("https://...");
    const [audioUrl, setAudioURL] = useState("");
    const [classificationResult, setClassificationResult] = useState("");

    Backend.setBackendRoute(backendRoute);

    function playAndClassifySound(e) {
        setAudioURL(value);

        Backend.classifyUrl(value)
            .then(result => {
                const message = `Predicted class: ${result.class_name} (${result.class_id})`;
                setClassificationResult(message);
            });
        e.preventDefault();
    }

    function renderAudioPlayer() {
        return <audio style={{ "height": 100 }} src={audioUrl} autoPlay controls loop>
            <a href={audioUrl}>Download file</a>

        </audio>
    }

    return (
        <Page>
            <PageSection>

                <TextContent>
                    <Text component={TextVariants.h2}>Enter the URL of a WAV file</Text>
                </TextContent>
                <br></br>
                <Form onSubmit={playAndClassifySound}>
                    <FormGroup>
                        <TextInput value={value} type="text" onChange={value => setValue(value)} aria-label="Paste the URL of a WAV file." />
                    </FormGroup>
                    <FormGroup>
                        <Button type="submit" variant="primary">Submit</Button>
                    </FormGroup>
                </Form>
                {audioUrl && renderAudioPlayer()}
                <div>{classificationResult}</div>
            </PageSection>
        </Page>
    )
}


// This gets called on every request
export async function getServerSideProps() {
    return { props: { backendRoute: process.env.BACKEND } };
}