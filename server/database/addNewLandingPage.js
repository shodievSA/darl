const { sequelize } = require("./models/user.js");
const getUserFreeTrials = require("./getUserFreeTrials.js");
const formatDate = require("../utils/formatDate.js");

async function addNewLandingPage(userID, landingPage, repoName) {

    const userFreeTrials = await getUserFreeTrials(userID);

    const newLandingPage = {
        value: landingPage,
        repoName: repoName,
        date: formatDate(),
        type: 'landing page',
        price: userFreeTrials > 0 ? 'free trial' : 0.4
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