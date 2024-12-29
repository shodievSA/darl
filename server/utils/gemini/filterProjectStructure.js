require("dotenv").config();
const { VertexAI } = require("@google-cloud/vertexai");

const vertexAI = new VertexAI({ 
    project: process.env.VERTEXAI_PTOJECT_ID
});

const content = "You will be given a project structure of a github repository " +
                "represented as a JSON object. Your goal is to get rid of all directories " +
                "and files which are not related to MAIN logic of the project. Examples of " +
                "unnecessary directories and files include icons, images, media files, assets folder, eslint configurarion, " +
                "dist folder, package.json and package-lock.json folders, node_modules, .gitignore, README.md requirements.txt and so on. " +
                "Reply directly with the modified JSON object without any language-specifying formats (e.g ```json```).";

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
