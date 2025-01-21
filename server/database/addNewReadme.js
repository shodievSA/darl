const { sequelize } = require("./models/user.js");
const getUserFreeTrials = require("./getUserFreeTrials.js");
const formatDate = require("../utils/formatDate.js");

async function addNewReadme(userID, readme, repoName) {

    const userFreeTrials = await getUserFreeTrials(userID);

    const newReadme = {
        value: readme,
        repoName: repoName,
        date: formatDate(),
        type: 'readme',
        price: userFreeTrials > 0 ? 'free trial' : 0.4
    }

    await sequelize.query(
        `UPDATE users SET user_history = :newReadme || user_history WHERE user_id = :userID`,
        {
            replacements: {
                newReadme: JSON.stringify([newReadme]),
                userID: userID,
            },
        }
    );

    return newReadme;

}

module.exports = addNewReadme;