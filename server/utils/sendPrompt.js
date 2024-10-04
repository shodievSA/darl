require("dotenv").config();
const OpenAI = require("openai");

const client = new OpenAI({
    organization: "org-60MkVWYTDG3x3L6IiJmlA1zb",
    project: "proj_4rHfWjp5cJ4w7GRNVSDtfecy",
    apiKey: process.env.CHAT_GPT_KEY
});

async function sendPrompt(prompt, res) {

    let description = "";

    const content = "You will be provided with the repository structure " +
                    "of a github user represented in the JSON format, as well as the contents of each " + 
                    "repository file. Your job is to carefully analyze each " +
                    "file and then generate a description of the project " +
                    "which will be appropriate for publishing in IT communitites like Hacker News. Avoid getting too technical."

    const stream = await client.chat.completions.create({
        messages: [
            { role: "system", content: content },
            { role: 'user', content: prompt }
        ],
        model: 'gpt-4o-mini',
        stream: true
    });

    for await (const chunk of stream) {

        const textChunk = chunk.choices[0]?.delta?.content || '';

        description += textChunk;
        res.write(textChunk); 

    }

    return description;

}

module.exports = sendPrompt;
