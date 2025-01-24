require("dotenv").config();
const { VertexAI } = require("@google-cloud/vertexai");

const vertexAI = new VertexAI({ 
    project: process.env.VERTEXAI_PTOJECT_ID
});

const instruction = "You are an AI designed to generate a single, detailed, and professional logo description based on GitHub repositories. " +
                    "Analyze the repository's content, purpose, and branding to craft one precise and vivid description " +
                    "of a logo that reflects its core essence and identity.";

async function generateLogoDescription(prompt) {

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

    const res = await generativeModel.generateContent(request);
    const logoDescription = res.response.candidates[0].content.parts[0].text;

    return logoDescription;

}

module.exports = generateLogoDescription;