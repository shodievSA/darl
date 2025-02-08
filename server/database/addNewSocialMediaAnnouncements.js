const { sequelize } = require("./models/user.js");
const formatDate = require("../utils/formatDate.js");

async function addNewSocialMediaAnnouncements(userID, announcements, repoName) {

    const newSocialMediaAnnouncements = {
        value: announcements,
        repoName: repoName,
        date: formatDate(),
        type: 'social media announcements'
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