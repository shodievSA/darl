require("dotenv").config();
const aiplatform = require("@google-cloud/aiplatform");

const projectID = process.env.VERTEXAI_PTOJECT_ID;
const model = "imagen-3.0-generate-002";
const location = "me-central1"

const { PredictionServiceClient } = aiplatform.v1;
const { helpers } = aiplatform;

const clientOptions = {
    apiEndpoint: `${location}-aiplatform.googleapis.com`,
};

const predictionServiceClient = new PredictionServiceClient(clientOptions);

async function generateLogo(logoDescription) {

    const endpoint = `projects/${projectID}/locations/${location}/publishers/google/models/${model}`;

    const promptText = { prompt: logoDescription };
    const instanceValue = helpers.toValue(promptText);
    const instances = [instanceValue];

    const parameter = {
        sampleCount: 1,
        aspectRatio: '1:1',
        safetyFilterLevel: 'block_none',
        personGeneration: 'dont_allow',
    };

    const parameters = helpers.toValue(parameter);

    const request = {
        endpoint,
        instances,
        parameters,
    };

    const [response] = await predictionServiceClient.predict(request);
    const logo = response.predictions[0].structValue.fields.bytesBase64Encoded.stringValue;

    return logo;

}

module.exports = generateLogo;