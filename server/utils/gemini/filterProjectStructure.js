require("dotenv").config();
const { VertexAI } = require("@google-cloud/vertexai");

const vertexAI = new VertexAI({ 
    project: process.env.VERTEXAI_PTOJECT_ID
});

const content = "You are an advanced text generative AI model tasked with filtering out " +
                "all directories and files from repository file structure unrelated to " +
                "the main logic of the project. Unnecessary items include assets such as " +
                "icons, images, media files, the assets folder, build output folders " +
                "(e.g., dist, node_modules), style files (e.g., CSS) and package-lock.json " +
                "file. Respond only with the modified JSON object, without any additional " +
                "formatting or enclosing markers (e.g., no ```json``` tags).";

const generativeModel = vertexAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction: content,
});

async function filterProjectStructure(projectStructure) {
    
    const request = {
        contents: [{ role: "user", parts: [{ text: projectStructure }]}]
    }

    const res = await generativeModel.generateContent(request);
    const filteredProjectStructure = res.response.candidates[0].content.parts[0].text;

    return filteredProjectStructure;

}

module.exports = filterProjectStructure;
