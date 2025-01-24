const getUserAccessToken = require("../../database/getAccessToken.js");

async function getAuthorCommits(props) {

    const { repoOwner, repoName, author, userID } = props;
    const accessToken = await getUserAccessToken(userID);

    const githubRes = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/commits?author=${author}`,
        {
            method: "GET",
            headers: {
                "Authorization": `token ${accessToken}`
            }
        }
    );

    const commits = await githubRes.json();

    for (const commit of commits) {

        const githubRes2 = await fetch(
            `https://api.github.com/repos/${repoOwner}/${repoName}/commits/${commit.sha}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `token ${accessToken}`
                }
            }
        )

    }

}

module.exports = getAuthorCommits;