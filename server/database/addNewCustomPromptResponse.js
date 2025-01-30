const { sequelize } = require("./models/user.js");
const getUserFreeTrials = require("./getUserFreeTrials.js");
const formatDate = require("../utils/formatDate.js");

async function addNewCustomPromptResponse(userID, customPromptResponse, repoName) {

    const userFreeTrials = await getUserFreeTrials(userID);

    const newCustomPromptResponse = {
        value: customPromptResponse,
        repoName: repoName,
        date: formatDate(),
        type: 'custom prompt',
        price: userFreeTrials > 0 ? 'free trial' : 0.2
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