const { sequelize } = require("./models/user.js");
const formatDate = require("../utils/formatDate.js");

async function addNewDescription(userID, description, repoName) {

    const newDescription = {
        value: description,
        repoName: repoName,
        date: formatDate(),
        type: 'description'
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