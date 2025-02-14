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
                           "Generate concise and formal description (no more than 90 words) of the project " +
                           "suitable for inclusion in a CV or resume. Make sure to describe the main " +
                           "functionality of the project and stack of technologies used. If the project has " +
                           "homepage or GitHub links, include them in your description too.\n\n"

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
                             "Create a responsive and user-friendly landing page with smooth animations for the GitHub repository. " +
                             "If the repository includes a color palette, incorporate " +
                             "it into the design. Use modern CSS libraries with ready-to-use components, " +
                             "such as Bootstrap or Tailwind CSS, to ensure a polished and responsive " +
                             "layout. If the repository is built with a frontend framework (e.g Next.js or React), " +
                             "develop the landing page using the same framework.\n\n" +
                             "Requirements:\n\n" +
                             "1. Hero Section:\n" +
                             "- Prominent headline that clearly communicates the value proposition\n" +
                             "- Engaging subheadline that elaborates on the main benefit\n" +
                             "- Primary CTA button above the fold\n" +
                             "- Optional: Background image or illustration that reinforces the message\n\n" +
                             "2. Features Section:\n" +
                             "- 3-4 key features presented in a grid or cards layout\n" +
                             "- Each feature should include an icon, heading, and brief description\n\n" +
                             "3. Social Proof Section:\n" +
                             "- Customer testimonials (2-3 featured quotes)\n" +
                             "- Logos of notable clients or partners\n" +
                             "- Key metrics or statistics demonstrating success\n\n" +
                             "4. How It Works Section:\n" +
                             "- Step-by-step explanation of the product/service\n" +
                             "- Use numbered steps or timeline design\n" +
                             "- Include relevant icons or illustrations\n\n" +
                             "5. Pricing Section (if applicable):\n" +
                             "- Clear pricing tiers in a comparative table or cards\n" +
                             "- List key features included in each tier\n\n" +
                             "6. Call-to-Action Section:\n" +
                             "- Compelling final CTA with urgency or incentive\n" +
                             "- Secondary supporting text addressing potential objections\n" +
                             "- Make the action button prominent and clear\n\n" +
                             "7. Footer:\n" +
                             "- Navigation links\n" +
                             "- Contact information\n" +
                             "- Social media links\n" +
                             "- Legal links (Privacy Policy, Terms of Service)\n\n";

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