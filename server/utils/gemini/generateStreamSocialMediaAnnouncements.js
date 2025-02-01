require("dotenv").config();
const { VertexAI } = require("@google-cloud/vertexai");

const instruction = "You are an advanced text generative AI model tasked with painstakingly analyzing " +
                    "the codebase of a GitHub repository to create social media announcements for it " +
                    "for various social platforms such as Twitter, LinkedIn and so on."

const vertexAI = new VertexAI({ 
    project: process.env.VERTEXAI_PTOJECT_ID
});

const generativeModel = vertexAI.getGenerativeModel({
    model: "gemini-1.5-pro",
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

async function generateStreamSocialMediaAnnouncements(prompt, res) {

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

module.exports = generateStreamSocialMediaAnnouncements;