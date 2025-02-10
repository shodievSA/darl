const sequelize = require("./sequelize.js");
const formatDate = require("../utils/formatDate.js");

async function addNewCustomPromptResponse(userID, customPromptResponse, repoName) {

    const newCustomPromptResponse = {
        value: customPromptResponse,
        repoName: repoName,
        date: formatDate(),
        type: 'custom prompt'
    }

    await sequelize.query(
        `UPDATE users SET user_history = :newCustomPromptResponse || user_history WHERE user_id = :userID`,
        {
            replacements: {
                newCustomPromptResponse: JSON.stringify([newCustomPromptResponse]),
                userID: userID,
            },
        }
    );

    return newCustomPromptResponse;

}

module.exports = addNewCustomPromptResponse;