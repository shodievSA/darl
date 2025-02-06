require("dotenv").config();
const { VertexAI } = require("@google-cloud/vertexai");

const vertexAI = new VertexAI({ 
    project: process.env.VERTEXAI_PTOJECT_ID
});

async function generateStreamArticle(prompt, reference, res) {

    let instruction = "";
    let fullResponse = "";

    if (reference.length > 0) {

        instruction = "You are an advanced text generative AI model tasked with painstakingly analyzing " +
                      "the codebase of a GitHub repository to generate high-quality " +
                      "articles tailored for IT professionals, developers and tech enthusiasts. " +
                      `Below, is a sample article that you must use as a template:\n\n${reference}`;

    } else {

        instruction = "You are an advanced text generative AI model tasked with painstakingly analyzing " +
                      "the codebase of a GitHub repository to generate high-quality " +
                      "articles tailored for IT professionals, developers and tech enthusiasts. " +
                      "Make sure to not get technical in your article.";

    }

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

module.exports = generateStreamArticle;