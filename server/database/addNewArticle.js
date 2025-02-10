const sequelize = require("./sequelize.js");
const formatDate = require("../utils/formatDate.js");

async function addNewArticle(userID, article, repoName) {

    const newArticle = {
        value: article,
        repoName: repoName,
        date: formatDate(),
        type: 'article'
    }

    await sequelize.query(
        `UPDATE users SET user_history = :newArticle || user_history WHERE user_id = :userID`,
        {
            replacements: {
                newArticle: JSON.stringify([newArticle]),
                userID: userID,
            },
        }
    );

    return newArticle;

}

module.exports = addNewArticle;