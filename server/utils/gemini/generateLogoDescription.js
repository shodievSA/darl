require("dotenv").config();
const { VertexAI } = require("@google-cloud/vertexai");

const vertexAI = new VertexAI({ 
    project: process.env.VERTEXAI_PTOJECT_ID
});

async function generateLogoDescription(prompt, companyName, logoStyle, backgroundColor) {

    let instruction = "";

    if (backgroundColor) {

        instruction = 
        "Analyze the GitHub repository's codebase to understand the company's core essence and purpose. " +
        "Using this analysis, create a concise prompt for generating a brand logo that visually represents the company. " +
        "Format your response as follows: " +
        `${logoStyle} logo [visual_element] on a solid, ${backgroundColor} background. Include the text ${companyName}.\n\n` +
        "Example: \"Simple flat vector logo of an eagle on a white background. Include the text Eagle Inc.\"";

    } else {

        instruction = 
        "Analyze the GitHub repository's codebase to understand the company's core essence and purpose. " +
        "Using this analysis, create a concise prompt for generating a brand logo that visually represents the company. " +
        "Format your response as follows: " +
        `${logoStyle} logo [visual_element] on a solid background. Include the text ${companyName}.\n\n` +
        "Example: \"Simple flat vector logo of an eagle on a white background. Include the text Eagle Inc.\"";

    }

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

    const request = {
        contents: [{ role: "user", parts: [{ text: prompt }]}]
    }

    const res = await generativeModel.generateContent(request);

    const logoPrompt = res.response.candidates[0].content.parts[0].text;
    const formattedLogoPrompt = logoPrompt.replace(/\*/g, '');

    return formattedLogoPrompt;

}

module.exports = generateLogoDescription;