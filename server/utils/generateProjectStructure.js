async function generateProjectStructure(arr, root, owner, repoName, accessToken, branch) {

    for (let i = 0; i < arr.length; i++)
    {
        if (arr[i].type == "file")
        {
            root[arr[i].name] = null;
        }
        else if (arr[i].type == "dir")
        {
            root[arr[i].name] = {};

            let githubRes = await fetch(
                `https://api.github.com/repos/${owner}/${repoName}/contents/${arr[i].path}?ref=${branch}`,
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
            await generateProjectStructure(
                data.entries, root[arr[i].name], owner, repoName, accessToken, branch
            );
        }
    }

    return root;

}

module.exports = generateProjectStructure;