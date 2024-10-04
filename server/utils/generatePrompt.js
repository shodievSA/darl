const getUserAccessToken = require("../database/getAccessToken.js")

async function generatePrompt(props) {

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

    let projectStructure = {};
    let fileContents = "File contents of each file:\n\n";

    async function generateProjectStructure(arr, root) {

        for (let i = 0; i < arr.length; i++)
        {
            if (arr[i].type == "file")
            {
                root[arr[i].name] = null;

                if (arr[i].name !== "package.json" && arr[i].name !== "package-lock.json")
                {
                    let githubRes = await fetch(
                        `https://api.github.com/repos/${owner}/${repoName}/contents/${arr[i].path}`,
                        {
                            method: "GET",
                            headers: {
                                "Accept": "application/vnd.github.raw+json",
                                "Authorization": `Bearer ${accessToken}`,
                                "X-GitHub-Api-Version": "2022-11-28"
                            }
                        }
                    );
    
                    let fileContent = await githubRes.text();
    
                    let fileExtension = null;
                    let regex = /\.([a-zA-Z0-9]+)$/;
                    let match = (arr[i].name).match(regex);
    
                    if (match)
                    {
                        fileExtension = match[1];
                    }
    
                    fileContents = fileContents + `${arr[i].name}:\n\`\`\`${fileExtension}\n${fileContent}\`\`\`\n\n`;
                }
            }
            else if (arr[i].type == "dir")
            {
                root[arr[i].name] = {};
    
                let githubRes = await fetch(
                    `https://api.github.com/repos/${owner}/${repoName}/contents/${arr[i].path}`,
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
    
                await generateProjectStructure(data.entries, root[arr[i].name]);
            }
        }

    }

    await generateProjectStructure(data.entries, projectStructure);

    projectStructure = "Repository structure represented in JSON format:\n\n```json" + JSON.stringify(projectStructure) + "\n```\n\n";
    let prompt = projectStructure + fileContents;

    return prompt;

}

module.exports = generatePrompt;