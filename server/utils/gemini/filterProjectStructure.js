require("dotenv").config();
const { VertexAI } = require("@google-cloud/vertexai");

const vertexAI = new VertexAI({ 
    project: process.env.VERTEXAI_PTOJECT_ID
});

const instructions = "You are an advanced code analysis AI model that filters repository " +
                     "file structures to focus on core application logic. Your task is to:\n\n" +
                     "1. Remove non-essential files and directories including:\n" +
                     "- Static assets (images, icons, media files, fonts)\n" +
                     "- Build artifacts and dependencies (dist/, build/, node_modules/, vendor/)\n" +
                     "- Generated files (*.min.js, *.min.css, package-lock.json, yarn.lock)\n" +
                     "- Style files (*.css, *.scss, *.less) unless they contain critical logic\n" +
                     "- Configuration files that don't impact core logic (*.config.js, .env.example)\n" +
                     "- Documentation files (*.md, docs/, wiki/)\n\n" +
                     "2. Retain critical files such as:\n" +
                     "- Source code files (*.js, *.ts, *.jsx, *.tsx, etc.)\n" +
                     "- Core configuration (package.json, tsconfig.json)\n" +
                     "- Entry points (main.js, index.js)\n" +
                     "- Business logic implementations\n" +
                     "- API integrations and services\n" +
                     "- Database schemas and migrations\n\n" +
                     "Return the filtered file structure as a valid JSON object, without " +
                     "markdown code blocks or additional formatting.\n\n" +
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

    return filteredProjectStructure;

}

module.exports = filterProjectStructure;
