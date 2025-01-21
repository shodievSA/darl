const { sequelize } = require("./models/user.js");
const getUserFreeTrials = require("./getUserFreeTrials.js");
const formatDate = require("../utils/formatDate.js");

async function addNewFeatures(userID, features, repoName) {

    const userFreeTrials = await getUserFreeTrials(userID);

    const newFeatures = {
        value: features,
        repoName: repoName,
        date: formatDate(),
        type: 'features',
        price: userFreeTrials > 0 ? 'free trial' : 0.4
    }

    await sequelize.query(
        `UPDATE users SET user_history = :newFeatures || user_history WHERE user_id = :userID`,
        {
            replacements: {
                newFeatures: JSON.stringify([newFeatures]),
                userID: userID,
            },
        }
    );

    return newFeatures;

}

module.exports = addNewFeatures;