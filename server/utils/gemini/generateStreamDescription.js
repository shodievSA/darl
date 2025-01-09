require("dotenv").config();
const { VertexAI } = require("@google-cloud/vertexai");

const vertexAI = new VertexAI({ 
    project: process.env.VERTEXAI_PTOJECT_ID
});

async function generateStreamDescription(prompt, reference) {

    let instruction = '';

    if (reference.length > 0) {

        instruction = "You are an advanced text generative AI model tasked with painstakingly analyzing " +
                      "the codebase of a GitHub repository to generate concise " +
                      "and professional descriptions suitable for inclusion in a CV/resume. " +
                      `Below, is a sample description that you must use as a template:\n\n${reference}`;

    } else {

        instruction = "You are an advanced text generative AI model tasked with painstakingly analyzing " +
                      "the codebase of a GitHub repository to generate concise " +
                      "and professional descriptions (no more than 90 words) suitable for inclusion in a CV/resume. " +
                      "Make sure to describe the main functionality of the project and stack of technologies used.";

    }

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

    const request = {
        contents: [{ role: "user", parts: [{ text: prompt }]}]
    }

    const resp = await generativeModel.generateContent(request);
    const contentResponse = resp.response;

    return contentResponse['candidates'][0]['content']['parts'][0]['text'];

}

module.exports = generateStreamDescription;