const { sequelize } = require("./models/user.js");
const getUserFreeTrials = require("./getUserFreeTrials.js");
const formatDate = require("../utils/formatDate.js");

async function addNewName(userID, name, repoName) {

    const userFreeTrials = await getUserFreeTrials(userID);

    const newName = {
        value: name,
        repoName: repoName,
        date: formatDate(),
        type: 'name',
        price: userFreeTrials > 0 ? 'free trial' : 0.2
    }

    await sequelize.query(
        `UPDATE users SET user_history = :newName || user_history WHERE user_id = :userID`,
        {
            replacements: {
                newName: JSON.stringify([newName]),
                userID: userID,
            },
        }
    );

    return newName;

}

module.exports = addNewName;