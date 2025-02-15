async function getFileContents(projectStructure, path, owner, repoName, accessToken, branchName) {
    // This function gets the content of the fetched files from project structure, it stops fetching when maxCharLimit is exceeded and returns the fetched content.
    let fileContents = "";
    let totalCharCount = 0;
    const maxCharLimit = 100000;
    const headers = {
        "Accept": "application/vnd.github.raw+json",
        "Authorization": `Bearer ${accessToken}`,
        "X-GitHub-Api-Version": "2022-11-28"
    };

    const fileExtensionRegex = /\.([a-zA-Z0-9]+)$/;

    async function fetchFile(filePath, fileName) {
        if (totalCharCount >= maxCharLimit) return null;

        const url = `https://api.github.com/repos/${owner}/${repoName}/contents/${filePath}?ref=${branchName}`;

        try {
            const res = await fetch(url, { method: "GET", headers });
            const fileContent = await res.text();
            const fileExtension = fileName.match(fileExtensionRegex)?.[1] || '';

            const formattedContent = `${fileName}:\n\`\`\`${fileExtension}\n${fileContent}\`\`\`\n\n`;

            if (totalCharCount + formattedContent.length > maxCharLimit) {
                return null; // Skip this file if it exceeds the limit
            }

            totalCharCount += formattedContent.length; // Add length of fetched content
            return formattedContent;

        } catch (error) {
            console.error(`Error fetching ${filePath}:`, error);
            return `${fileName}: Error fetching file\n\n`;
        }
    }

    function collectFiles(structure, currentPath = '', result = []) {
        for (const [key, value] of Object.entries(structure)) {
            if (value && typeof value === 'object') {
                collectFiles(value, currentPath + key + '/', result);
            } else {
                result.push({
                    path: currentPath + key,
                    name: key
                });
            }
        }
        return result;
    }

    const files = collectFiles(projectStructure, path);

    const concurrencyLimit = 10;
    let allResults = '';

    for (let i = 0; i < files.length; i += concurrencyLimit) {
        const batch = files.slice(i, i + concurrencyLimit).map(file =>
            fetchFile(file.path, file.name)
        );

        const batchResults = await Promise.all(batch);
        for (const content of batchResults) {
            if (content) {
                allResults += content;
            }
            if (totalCharCount >= maxCharLimit) {
                console.log(`Total Characters: ${totalCharCount} (Limit Reached)`);
                return allResults;
            }
        }
    }

    console.log(`Total Characters: ${totalCharCount}`);
    return allResults;
}

module.exports = getFileContents;
