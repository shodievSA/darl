require("dotenv").config();
const { VertexAI } = require("@google-cloud/vertexai");

const vertexAI = new VertexAI({ 
    project: process.env.VERTEXAI_PTOJECT_ID
});

const content = "You are an advanced text generative AI model tasked with analyzing " +
                "the description of a GitHub repository to generate a detailed " +
                "and concise prompt for generating a logo. Make sure your prompt is " +
                "around 50 words and avoid asking the model to include words, letters " +
                "and digits on a logo.";

const generativeModel = vertexAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction: content,
});

async function generateLogoDescription(description) {

    const request = {
        contents: [{ role: "user", parts: [{ text: description }]}]
    }

    const res = await generativeModel.generateContent(request);
    const logoDescription = res.response.candidates[0].content.parts[0].text;

    return logoDescription;

}

module.exports = generateLogoDescription;