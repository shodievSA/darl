require("dotenv").config();
const { VertexAI } = require("@google-cloud/vertexai");

const content = "You are an advanced text generative AI model tasked with analyzing " +
                "the contents of a user's GitHub repository to generate a well-structured " +
                "and informative text for README file. Make sure the text provides clear " +
                "instructions on how to set up and use the repository.";

const vertexAI = new VertexAI({ 
    project: process.env.VERTEXAI_PTOJECT_ID
});

const generativeModel = vertexAI.getGenerativeModel({
    model: "gemini-2.0-flash-001",
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

async function streamReadme(prompt, res) {

    let fullResponse = "";

    const request = {
        contents: [{ role: "user", parts: [{ text: prompt }]}]
    }

    const result = await generativeModel.generateContentStream(request);

    for await (const item of result.stream) {

        const chunkText = item.candidates[0].content.parts[0].text;
        fullResponse += chunkText;

        res.write(`data: ${JSON.stringify({ type: "chunk", content: chunkText })}\n\n`);

    }

    return fullResponse;

}

module.exports = streamReadme;