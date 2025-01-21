async function getFileContents(projectStructure, path, owner, repoName, accessToken) {

    let fileContents = "";
    let filePath = path;

    // await Promise.all(Object.entries(projectStructure).map(async (item) => {

    //     if (
    //         typeof item[1] === 'object' 
    //         && 
    //         item[1] !== null
    //     ) {
    //         let oldPath = filePath;

    //         filePath = filePath + item[0] + "/";

    //         fileContents += await getFileContents(
    //             item[1], 
    //             filePath, 
    //             owner, 
    //             repoName, 
    //             accessToken
    //         );

    //         filePath = oldPath;

    //     } else {

    //         let res = await fetch(
    //             `https://api.github.com/repos/${owner}/${repoName}/contents/${filePath + item[0]}`,
    //             {
    //                 method: "GET",
    //                 headers: {
    //                     "Accept": "application/vnd.github.raw+json",
    //                     "Authorization": `Bearer ${accessToken}`,
    //                     "X-GitHub-Api-Version": "2022-11-28"
    //                 }
    //             }
    //         );

    //         let fileContent = await res.text();

    //         let fileExtension = null;
    //         let regex = /\.([a-zA-Z0-9]+)$/;
    //         let match = item[0].match(regex);
    
    //         if (match) {
    //             fileExtension = match[1];
    //         }
    
    //         fileContents += `${item[0]}:\n\n\`\`\`${fileExtension}\n${fileContent}\`\`\`\n\n`;

    //     }

    // }))

    for (const key in projectStructure) {

        if (
            typeof projectStructure[key] === 'object' 
            && 
            projectStructure[key] !== null
        ) {
            let oldPath = filePath;

            filePath = filePath + key + "/";

            fileContents += await getFileContents(
                projectStructure[key], 
                filePath, 
                owner, 
                repoName, 
                accessToken
            );

            filePath = oldPath;

        } else {

            let res = await fetch(
                `https://api.github.com/repos/${owner}/${repoName}/contents/${filePath + key}`,
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/vnd.github.raw+json",
                        "Authorization": `Bearer ${accessToken}`,
                        "X-GitHub-Api-Version": "2022-11-28"
                    }
                }
            );

            let fileContent = await res.text();

            let fileExtension = null;
            let regex = /\.([a-zA-Z0-9]+)$/;
            let match = key.match(regex);
    
            if (match) {
                fileExtension = match[1];
            }
    
            fileContents += `${key}:\n\n\`\`\`${fileExtension}\n${fileContent}\`\`\`\n\n`;

        }

    }

    return fileContents;

}

module.exports = getFileContents;