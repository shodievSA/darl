const getUserAccessToken = require("../database/getAccessToken.js");
const filterProjectStructure = require("./gemini/filterProjectStructure.js");
const generateProjectStructure = require("./generateProjectStructure.js");
const getFileContents = require("./getFileContents.js");

async function createPrompt(props) {

    const { 
        userID, 
        repoOwner, 
        repoName, 
        branchName, 
        homepageURL, 
        res 
    } = props;

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

    res.write(`data: ${JSON.stringify({ type: "status", content: "Fetching repository file structure..." })}\n\n`);

    let projectStructure = await generateProjectStructure(
        data.entries, {}, repoOwner, repoName, accessToken, branchName
    );

    res.write(`data: ${JSON.stringify({ type: "status", content: "Filtering repository file structure..." })}\n\n`);

    let filteredProjectStructure = await filterProjectStructure(
        JSON.stringify(projectStructure)
    );

    res.write(`data: ${JSON.stringify({ type: "status", content: "Fetching repository files..." })}\n\n`);
    
    let fileContents = await getFileContents(
        filteredProjectStructure, 
        "", 
        repoOwner, 
        repoName, 
        accessToken,
        branchName
    );

    fileContents = "[GitHub Repository Codebase]:\n" + fileContents;
    let extraInformation = `[Extra Repository Information]:\n` +
                           `Homepage link: ${ homepageURL ? homepageURL + "\n" : "N/A\n" }` +
                           `GitHub repository name: ${repoName}\n` +
                           `GitHub repository link: https://github.com/${repoOwner}/${repoName}`;

    const prompt = fileContents + extraInformation + "\n\n";
    return prompt;

}

module.exports = createPrompt;