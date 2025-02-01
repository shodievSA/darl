const { sequelize } = require("./models/user.js");
const getUserFreeTrials = require("./getUserFreeTrials.js");
const formatDate = require("../utils/formatDate.js");

async function addNewDescription(userID, description, repoName) {

    const userFreeTrials = await getUserFreeTrials(userID);

    const newDescription = {
        value: description,
        repoName: repoName,
        date: formatDate(),
        type: 'description',
        price: userFreeTrials > 0 ? 'free trial' : 0.4
    }

    await sequelize.query(
        `UPDATE users SET user_history = :newDescription || user_history WHERE user_id = :userID`,
        {
            replacements: {
                newDescription: JSON.stringify([newDescription]),
                userID: userID,
            },
        }
    );

    return newDescription;

}

module.exports = addNewDescription;