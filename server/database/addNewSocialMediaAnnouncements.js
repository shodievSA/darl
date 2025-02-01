const { sequelize } = require("./models/user.js");
const getUserFreeTrials = require("./getUserFreeTrials.js");
const formatDate = require("../utils/formatDate.js");

async function addNewSocialMediaAnnouncements(userID, announcements, repoName) {

    const userFreeTrials = await getUserFreeTrials(userID);

    const newSocialMediaAnnouncements = {
        value: announcements,
        repoName: repoName,
        date: formatDate(),
        type: 'social media announcements',
        price: userFreeTrials > 0 ? 'free trial' : 0.4
    }

    await sequelize.query(
        `UPDATE users SET user_history = :newSocialMediaAnnouncements || user_history WHERE user_id = :userID`,
        {
            replacements: {
                newSocialMediaAnnouncements: JSON.stringify([newSocialMediaAnnouncements]),
                userID: userID,
            },
        }
    );

    return newSocialMediaAnnouncements;

}

module.exports = addNewSocialMediaAnnouncements;