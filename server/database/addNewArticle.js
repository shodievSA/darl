const { sequelize } = require("./models/user.js");
const getUserFreeTrials = require("./getUserFreeTrials.js");
const formatDate = require("../utils/formatDate.js");

async function addNewArticle(userID, article, repoName) {

    const userFreeTrials = await getUserFreeTrials(userID);

    const newArticle = {
        value: article,
        repoName: repoName,
        date: formatDate(),
        type: 'article',
        price: userFreeTrials > 0 ? 'free trial' : 0.4
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