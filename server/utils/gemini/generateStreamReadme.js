require("dotenv").config();
const { VertexAI } = require("@google-cloud/vertexai");

const content = "You will be provided with the repository structure " +
                "of a github user represented in the JSON format, as well as the contents of each " + 
                "repository file. Your job is to carefully analyze each " +
                "file and then generate a technical text for 'README.md' file designed for developers.";

const vertexAI = new VertexAI({ 
    project: process.env.VERTEXAI_PTOJECT_ID
});

const generativeModel = vertexAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction: content
});

async function generateStreamReadme(prompt, res) {

    let article = "";

    const request = {
        contents: [{ role: "user", parts: [{ text: prompt }]}]
    }

    const result1 = await generativeModel.generateContentStream(request);

    for await (const item of result1.stream) {

        let textChunk = item.candidates[0].content.parts[0].text;

        article += textChunk;
        res.write(textChunk); 

    }

    return article;

}

module.exports = generateStreamReadme;