const getUserAccessToken = require("../database/getAccessToken.js");
const filterProjectStructure = require("./gemini/filterProjectStructure.js");
const generateProjectStructure = require("./generateProjectStructure.js");
const getFileContents = require("./getFileContents.js");

async function createPrompt(props) {

    const { userID, repoOwner, repoName, branchName, res } = props;
    const accessToken = await getUserAccessToken(userID);

    const response = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents?ref=${branchName}`,
        {
            method: "GET",
            headers: {
                "Accept": "application/vnd.github.object+json",
                "Authorization": `Bearer ${accessToken}`,
                "X-GitHub-Api-Version": "2022-11-28"
            }
        }
    );

    const data = await response.json();

    res.write(`data: ${JSON.stringify({ type: "status", content: "Fetching repository structure..." })}\n\n`);

    let projectStructure = await generateProjectStructure(
        data.entries, {}, repoOwner, repoName, accessToken, branchName
    );

    let filteredProjectStructure = await filterProjectStructure(
        JSON.stringify(projectStructure)
    );

    res.write(`data: ${JSON.stringify({ type: "status", content: "Fetching repository files..." })}\n\n`);
    
    let fileContents = await getFileContents(
        JSON.parse(filteredProjectStructure), 
        "", 
        repoOwner, 
        repoName, 
        accessToken,
        branchName
    );
    
    let extraInformation = `Extra information about the repository:\n\n` +
                           `Repository name: ${repoName}\n` +
                           `Repository owner: ${repoOwner}\n` +
                           `Branch name: ${branchName}\n` +
                           `Repository link: https://github.com/${repoOwner}/${repoName}`;

    filteredProjectStructure = "Repository structure represented in JSON format:\n\n" +
                               "```json\n" + JSON.stringify(filteredProjectStructure) + "\n" +
                               "```\n\n";

    fileContents = "Contents of each file:\n\n" + fileContents + "\n\n";

    const prompt = filteredProjectStructure + fileContents + extraInformation;
    
    return prompt;

}

module.exports = createPrompt;