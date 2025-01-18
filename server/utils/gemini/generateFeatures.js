require("dotenv").config();
const { VertexAI } = require("@google-cloud/vertexai");

const instruction = "You are an advanced text generative AI model tasked with painstakingly analyzing " +
                    "the codebase of a GitHub repository to suggest a list of extra cool features " +
                    "that the user can develop and add to their project.";

const vertexAI = new VertexAI({ 
    project: process.env.VERTEXAI_PTOJECT_ID
});

const generativeModel = vertexAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction: instruction,
    safetySettings: [
        {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE',
        },
        {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE',
        },
        {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE',
        },
        {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
        }
    ]
});

async function generateFeatures(prompt) {

    const request = {
        contents: [{ role: "user", parts: [{ text: prompt }]}]
    }

    const resp = await generativeModel.generateContent(request);
    const contentResponse = resp.response;

    return contentResponse['candidates'][0]['content']['parts'][0]['text'];

}

module.exports = generateFeatures;