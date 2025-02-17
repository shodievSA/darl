require("dotenv").config();
const { VertexAI } = require("@google-cloud/vertexai");

const vertexAI = new VertexAI({ 
    project: process.env.VERTEXAI_PTOJECT_ID
});

const instructions = "You are an advanced code analysis AI model that filters repository " +
                     "file structure, which will be provided as a JSON object, to focus on core " +
                     "application logic. Your task is to:\n\n" +
                     "1. Remove non-essential files and directories including:\n" +
                     "- Static assets (images, icons, media files, fonts, audio files)\n" +
                     "- Build artifacts and dependencies (dist/, build/, node_modules/, vendor/)\n" +
                     "- Generated files (*.min.js, *.min.css, package-lock.json, package.json, yarn.lock)\n" +
                     "- Style files (*.css, *.scss, *.less)\n" +
                     "- Configuration files (*.config.js, .env.example, eslint.config.js, vite.config.js)\n" +
                     "- Documentation files (*.md, docs/, wiki/)\n" +
                     "- Git files (.gitignore)\n\n" +
                     "2. Retain critical files such as:\n" +
                     "- Source code files (*.js, *.ts, *.jsx, *.tsx, etc.)\n" +
                     "- Entry points (main.js, index.js)\n" +
                     "- Business logic implementations\n" +
                     "- API integrations and services\n" +
                     "- Utility functions\n\n"
                     "You must reply directly with the filtered file structure represented " +
                     "as a valid JSON object, without any markdown code blocks (e.g ```json ```).\n\n" +
                     "Note: If uncertain about a file's importance, preserve it in the output " +
                     "to avoid removing potentially critical components.";

const generativeModel = vertexAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction: instructions,
});

async function filterProjectStructure(projectStructure) {
    
    const request = {
        contents: [{ role: "user", parts: [{ text: projectStructure }]}]
    }

    const res = await generativeModel.generateContent(request);
    const filteredProjectStructure = res.response.candidates[0].content.parts[0].text;

    return cleanJsonResponse(filteredProjectStructure);

}

function cleanJsonResponse(aiResponse) {

    const cleaned = aiResponse.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(cleaned);

}

module.exports = filterProjectStructure;
