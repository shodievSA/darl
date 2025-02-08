const { sequelize } = require("./models/user.js");
const formatDate = require("../utils/formatDate.js");

async function addNewLandingPage(userID, landingPage, repoName) {

    const newLandingPage = {
        value: landingPage,
        repoName: repoName,
        date: formatDate(),
        type: 'landing page'
    }

    await sequelize.query(
        `UPDATE users SET user_history = :newLandingPage || user_history WHERE user_id = :userID`,
        {
            replacements: {
                newLandingPage: JSON.stringify([newLandingPage]),
                userID: userID,
            },
        }
    );

    return newLandingPage;

}

module.exports = addNewLandingPage;