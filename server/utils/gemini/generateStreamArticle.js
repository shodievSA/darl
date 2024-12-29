require("dotenv").config();
const { VertexAI } = require("@google-cloud/vertexai");

const content = "You are an advanced text generative AI model tasked with analyzing " +
                "the contents of a user's GitHub repository to generate high-quality " +
                "articles tailored for IT professionals, developers, and tech enthusiasts. " +
                "Assume the audience has a moderate understanding of technology.";

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

async function generateStreamArticle(prompt) {

    const request = {
        contents: [{ role: "user", parts: [{ text: prompt }]}]
    }

    const resp = await generativeModel.generateContent(request);
    const contentResponse = resp.response;

    console.log(contentResponse);

    return contentResponse['candidates'][0]['content']['parts'][0]['text'];

}

module.exports = generateStreamArticle;