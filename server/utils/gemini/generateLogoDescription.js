require("dotenv").config();
const { VertexAI } = require("@google-cloud/vertexai");

const vertexAI = new VertexAI({ 
    project: process.env.VERTEXAI_PTOJECT_ID
});

const content = "You will be given a description of the user's github project. " +
                "Your job is to summarize this description into SIMPLE logo description " +
                "which will be then given to AI image-generation model. Make sure your logo " +
                "description is no more than 50 words and avoid asking the model to draw words on a logo. " +
                "Reply directly with the logo description.";

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