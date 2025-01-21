require("dotenv").config();
const { VertexAI } = require("@google-cloud/vertexai");

const vertexAI = new VertexAI({ 
    project: process.env.VERTEXAI_PTOJECT_ID
});

const instruction = "You are an advanced text-generation AI specialized in analyzing GitHub codebases. " +
                    "Your task is to create concise logo-generation prompt (maximum 50 words) " +
                    "for an image-generation AI model. Ensure that the prompts do not request the inclusion " +
                    "of words, letters or digits in the logo. Focus on clarity, creativity and relevance to the repository's context.";

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