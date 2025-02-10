const generativeModel = require("./gemini.js");

async function streamSocialMediaAnnouncements(repoDetails, res) {

    const requestedContent = "[Requested Content]:\n" +
                             "Generate engaging social media announcements tailored for platforms " +
                             "like Twitter, LinkedIn, and more. Craft concise, compelling messages that " +
                             "highlight the project's key features, updates, or milestones while adapting " +
                             "the tone and format to each platform. Reply directly with the social media announcements.\n\n";

    const prompt = requestedContent + repoDetails;

    let fullResponse = "";

    const request = {
        contents: [{ role: "user", parts: [{ text: prompt }]}]
    }

    const response = await generativeModel.generateContentStream(request);
    
    for await (const item of response.stream) {

        const chunkText = item.candidates[0].content.parts[0].text;
        fullResponse += chunkText;

        res.write(`data: ${JSON.stringify({ type: "chunk", content: chunkText })}\n\n`);

    }

    return fullResponse;

}

async function streamReadme(repoDetails, res) {

    const requestedContent = "[Requested Content]:\n" +
                             "Generate comprehensive and well-structured text for a README file for the repository. " +
                             "Ensure the README text includes clear and detailed setup instructions, covering installation, " +
                             "dependencies, configuration, and any necessary environment variables. Provide step-by-step " +
                             "guidance for running the project.\n\n";

    const prompt = requestedContent + repoDetails;

    let fullResponse = "";

    const request = {
        contents: [{ role: "user", parts: [{ text: prompt }]}]
    }

    const response = await generativeModel.generateContentStream(request);

    for await (const item of response.stream) {

        const chunkText = item.candidates[0].content.parts[0].text;
        fullResponse += chunkText;

        res.write(`data: ${JSON.stringify({ type: "chunk", content: chunkText })}\n\n`);

    }

    return fullResponse;

}

async function streamDescription(repoDetails, reference, res) {

    let requestedContent = "";

    if (reference) {

        requestedContent = "[Requested Content]:\n" +
                           "Generate concise and professional description of the project " +
                           "suitable for inclusion in a CV or resume. Use the provided template as " +
                           "a strict format guide to ensure consistency and clarity. Reply directly " +
                           "with the formatted description.\n\n" +
                           "[Reference]:\n" + reference + "\n\n";

    } else {

        requestedContent = "[Requested Content]:\n" +
                           "Generate concise and professional description (no more than 90 words) of the project " +
                           "suitable for inclusion in a CV or resume. Make sure to describe the main " +
                           "functionality of the project and stack of technologies used.\n\n";

    }

    const prompt = requestedContent + repoDetails;

    let fullResponse = "";

    const request = {
        contents: [{ role: "user", parts: [{ text: prompt }]}]
    }

    const response = await generativeModel.generateContentStream(request);

    for await (const item of response.stream) {

        const chunkText = item.candidates[0].content.parts[0].text;
        fullResponse += chunkText;

        res.write(`data: ${JSON.stringify({ type: "chunk", content: chunkText })}\n\n`);

    }

    return fullResponse;

}

async function streamArticle(repoDetails, reference, res) {

    let requestedContent = "";

    if (reference) {

        requestedContent = "[Requested Content]:\n" +
                           "Generate clear, high-quality article about the project. Use the provided " +
                           "template as a strict format guide to ensure consistency and clarity. " +
                           "Reply directly with the formatted article.\n\n" +
                           "[Reference]:\n" + reference + "\n\n";

    } else {

        requestedContent = "[Requested Content]:\n" +
                           "Generate clear, high-quality article for general audience. Your article " +
                           "should be engaging, easy to understand, and free of unnecessary jargon. " +
                           "Reply directly with the article.\n\n";

    }

    const prompt = requestedContent + repoDetails;

    let fullResponse = "";

    const request = {
        contents: [{ role: "user", parts: [{ text: prompt }]}]
    }

    const response = await generativeModel.generateContentStream(request);

    for await (const item of response.stream) {

        const chunkText = item.candidates[0].content.parts[0].text;
        fullResponse += chunkText;

        res.write(`data: ${JSON.stringify({ type: "chunk", content: chunkText })}\n\n`);

    }

    return fullResponse;
    
}

async function streamLandingPage(repoDetails, res) {

    const requestedContent = "[Requested Content]:\n" +
                             "Create a well-crafted, user-friendly landing page for the GitHub repository. " +
                             "Ensure the design effectively highlights the project's key features " +
                             "and goals. If the repository includes a color palette, incorporate " +
                             "it into the design. Use CSS libraries with ready-to-use components, " +
                             "such as Bootstrap or Tailwind CSS, to ensure a polished and responsive " +
                             "layout. If the landing page requires a special setup, include clear and " +
                             "concise setup instructions in your response.\n\n";

    const prompt = requestedContent + repoDetails;

    let fullResponse = "";

    const request = {
        contents: [{ role: "user", parts: [{ text: prompt }]}]
    }

    const response = await generativeModel.generateContentStream(request);

    for await (const item of response.stream) {

        const chunkText = item.candidates[0].content.parts[0].text;
        fullResponse += chunkText;

        res.write(`data: ${JSON.stringify({ type: "chunk", content: chunkText })}\n\n`);

    }

    return fullResponse;

}

async function streamResponseForCustomPrompt(repoDetails, customUserRequest, res) {

    const prompt = `[Requested Content:]\n ${customUserRequest}\n\n` + repoDetails;

    let fullResponse = "";

    const request = {
        contents: [{ role: "user", parts: [{ text: prompt }]}]
    }

    const response = await generativeModel.generateContentStream(request);

    for await (const item of response.stream) {

        const chunkText = item.candidates[0].content.parts[0].text;
        fullResponse += chunkText;

        res.write(`data: ${JSON.stringify({ type: "chunk", content: chunkText })}\n\n`);

    }

    return fullResponse;

}

async function generateLogoDescription(repoDetails, companyName, logoStyle, backgroundColor = null) {

    let requestedContent = "";

    if (backgroundColor) {

        requestedContent = "[Requested Content]:\n" +
                           "Analyze the company's GitHub repository in order to understand its core essence and purpose. " +
                           "Using this analysis, create a concise prompt for generating a brand logo that visually represents the company. " +
                           "Format your response as follows: " +
                           `${logoStyle} logo [visual_element] on a solid, ${backgroundColor} background. Include the text ${companyName}.\n\n` +
                           "Example: \"Simple flat vector logo of an eagle on a white background. Include the text Eagle Inc.\"\n\n";

    } else {

        requestedContent = "[Requested Content]:\n" +
                           "Analyze the company's GitHub repository in order to understand its core essence and purpose. " +
                           "Using this analysis, create a concise prompt for generating a brand logo that visually represents the company. " +
                           "Format your response as follows: " +
                           `${logoStyle} logo [visual_element] on a solid background. Include the text ${companyName}.\n\n` +
                           "Example: \"Simple flat vector logo of an eagle on a white background. Include the text Eagle Inc.\"\n\n";

    }

    const prompt = requestedContent + repoDetails;

    const request = {
        contents: [{ role: "user", parts: [{ text: prompt }]}]
    }

    const response = await generativeModel.generateContent(request);

    const logoPrompt = response.response.candidates[0].content.parts[0].text;
    const formattedLogoPrompt = logoPrompt.replace(/\*/g, '');

    return formattedLogoPrompt;

}

const gemini = {
    streamSocialMediaAnnouncements,
    streamReadme,
    streamDescription,
    streamArticle,
    streamLandingPage,
    streamResponseForCustomPrompt,
    generateLogoDescription
}

module.exports = gemini;