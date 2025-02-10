const vertexAI = require("./vertexai.js");

const instruction = "You are an advanced AI model designed to generate high-quality content based on GitHub repositories. " +
                    "Prompts will include the requested content, which you need to generate, repository's codebase, " +
                    "additional metadata like repository's GitHub link, repository name, and homepage link (if available). " +
                    "In some cases, a reference template will be provided to guide content generation.\n\n" +
                    "The prompt structure follows this format:\n\n" +
                    "[Requested Content]:\n" +
                    "Specifies the content you need to generate.\n\n" +
                    "[Reference]:\n" +
                    "(Optional) A sample template to follow when generating specific content, " +
                    "such as a description or article.\n\n" +
                    "[GitHub Repository Codebase]:\n" +
                    "Contains the file contents of the GitHub repository for which you need to generate the content.\n\n" +
                    "[Extra Repository Information]:\n" +
                    "Includes metadata such as the repository name, GitHub link, and homepage (if available).";

const generativeModel = vertexAI.getGenerativeModel({
    model: "gemini-2.0-flash-001",
    systemInstruction: instruction,
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

module.exports = generativeModel;