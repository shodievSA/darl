require("dotenv").config();
const aiplatform = require("@google-cloud/aiplatform");

const projectID = process.env.VERTEXAI_PTOJECT_ID;
const model = "imagen-3.0-generate-001";
const location = "me-central1"

const { PredictionServiceClient } = aiplatform.v1;
const { helpers } = aiplatform;

const clientOptions = {
    apiEndpoint: `${location}-aiplatform.googleapis.com`,
};

const predictionServiceClient = new PredictionServiceClient(clientOptions);

async function generateLogo(logoDescription, resolution) {

    const endpoint = `projects/${projectID}/locations/${location}/publishers/google/models/${model}`;

    const promptText = {
        prompt: logoDescription
    };
    const instanceValue = helpers.toValue(promptText);
    const instances = [instanceValue];

    const parameter = {
        sampleCount: 1,
        aspectRatio: '1:1',
        safetyFilterLevel: 'block_some',
        personGeneration: 'allow_adult',
    };

    const parameters = helpers.toValue(parameter);

    const request = {
        endpoint,
        instances,
        parameters,
    };

    const [response] = await predictionServiceClient.predict(request);
    const prediction = response.predictions[0];

    return prediction.structValue.fields.bytesBase64Encoded.stringValue;

}


// async function generateLogo(logoDescription, resolution) {

//     const projectID = process.env.VERTEXAI_PTOJECT_ID;
//     const model = "imagen-3.0-generate-001";
//     const gcToken = process.env.GCLOUD_ACCESS_TOKEN;
//     const location = "me-central1"

//     const requestBody = {
//         instances: [
//             {
//                 prompt: logoDescription
//             }
//         ],
//         parameters: {
//             sampleCount: 1
//         }
//     }

//     try {

//         let res = await fetch(
//             `https://${location}-aiplatform.googleapis.com/v1/projects/${projectID}/locations/${location}/publishers/google/models/${model}:predict`,
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${gcToken}`
//                 },
//                 body: JSON.stringify(requestBody)
//             }
//         );

//         let data = await res.json();

//         console.log(data)

//         return data["predictions"][0]['bytesBase64Encoded'];

//     } catch (err) {

//         console.log("The following error occured: " + err);

//     }

// }

module.exports = generateLogo;