const { sequelize } = require("./models/user.js");
const getUserFreeTrials = require("./getUserFreeTrials.js");
const formatDate = require("../utils/formatDate.js");

async function addNewLogo(userID, repoName) {

    const userFreeTrials = await getUserFreeTrials(userID);

    const newLogo = {
        value: `${userID}/${repoName}-${Date.now()}.png`,
        repoName: repoName,
        date: formatDate(),
        type: 'logo',
        price: userFreeTrials > 0 ? 'free trial' : 0.8
    }

    await sequelize.query(
        `UPDATE users SET user_history = :newLogo || user_history WHERE user_id = :userID`,
        {
            replacements: {
                newLogo: JSON.stringify([newLogo]),
                userID: userID,
            },
        }
    );

    return newLogo;

}

module.exports = addNewLogo;