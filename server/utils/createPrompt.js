const getUserAccessToken = require("../database/getAccessToken.js");
const filterProjectStructure = require("./gemini/filterProjectStructure.js");
const generateProjectStructure = require("./generateProjectStructure.js");
const getFileContents = require("./getFileContents.js");

async function createPrompt(props) {

    const { 

        userID,
        owner,
        repoName

    } = props;

    const accessToken = await getUserAccessToken(userID);

    let githubRes = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/contents`,
        {
            method: "GET",
            headers: {
                "Accept": "application/vnd.github.object+json",
                "Authorization": `Bearer ${accessToken}`,
                "X-GitHub-Api-Version": "2022-11-28"
            }
        }
    );

    let data = await githubRes.json();

    let projectStructure = await generateProjectStructure(
        data.entries, {}, owner, repoName, accessToken
    );

    let filteredProjectStructure = await filterProjectStructure(
        JSON.stringify(projectStructure)
    );

    let fileContents = await getFileContents(
        JSON.parse(filteredProjectStructure), 
        "", 
        owner, 
        repoName, 
        accessToken
    );

    filteredProjectStructure = "Repository structure represented in JSON format:\n\n" +
                               "```json\n" + JSON.stringify(filteredProjectStructure) + "\n" +
                               "```\n\n";
    fileContents = "File contents of each file:\n\n" + fileContents;

    let prompt = filteredProjectStructure + fileContents;
    
    return prompt;

}

module.exports = createPrompt;