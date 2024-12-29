require("dotenv").config();
const { VertexAI } = require("@google-cloud/vertexai");

const content = "You are an advanced text generative AI model tasked with analyzing " +
                "the contents of a user's GitHub repository to generate a well-structured " +
                "and informative text for README file. Make sure the text provides clear " +
                "instructions on how to set up and use the repository.";

const vertexAI = new VertexAI({ 
    project: process.env.VERTEXAI_PTOJECT_ID
});

const generativeModel = vertexAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction: content,
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

async function generateStreamReadme(prompt) {

    const request = {
        contents: [{ role: "user", parts: [{ text: prompt }]}]
    }

    const resp = await generativeModel.generateContent(request);
    const contentResponse = resp.response;

    return contentResponse['candidates'][0]['content']['parts'][0]['text'];

}

module.exports = generateStreamReadme;