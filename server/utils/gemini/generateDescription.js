require("dotenv").config();
const { VertexAI } = require("@google-cloud/vertexai");

const vertexAI = new VertexAI({ 
    project: process.env.VERTEXAI_PTOJECT_ID
});

const content = "You will be provided with the repository structure " +
                "of a github user represented in the JSON format, as well as the contents of each " + 
                "repository file. Your job is to carefully analyze each " +
                "file and then generate a detailed description of the project."

const generativeModel = vertexAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction: content,
});

async function generateDescription(prompt) {

    const request = {
        contents: [{ role: "user", parts: [{ text: prompt }]}]
    }

    const res = await generativeModel.generateContent(request);
    const description = res.response.candidates[0].content.parts[0].text;

    return description;

}

module.exports = generateDescription;