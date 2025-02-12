const sequelize = require("./sequelize.js");
const formatDate = require("../utils/formatDate.js");

async function addNewArticle(userID, article, repoName) {

    const newArticle = {
        value: article,
        repoName: repoName,
        date: formatDate(),
        type: 'article'
    }

    await sequelize.query(
        `UPDATE users SET user_history = :newArticle || user_history WHERE user_id = :userID`,
        {
            replacements: {
                newArticle: JSON.stringify([newArticle]),
                userID: userID,
            },
        }
    );

    return newArticle;

}

async function addNewCustomPromptResponse(userID, customPromptResponse, repoName) {

    const newCustomPromptResponse = {
        value: customPromptResponse,
        repoName: repoName,
        date: formatDate(),
        type: 'custom prompt'
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

async function addNewLogo(userID, repoName) {

    const newLogo = {
        value: `${userID}/${repoName}-${Date.now()}.png`,
        repoName: repoName,
        date: formatDate(),
        type: 'logo'
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

async function addNewReadme(userID, readme, repoName) {

    const newReadme = {
        value: readme,
        repoName: repoName,
        date: formatDate(),
        type: 'readme'
    }

    await sequelize.query(
        `UPDATE users SET user_history = :newReadme || user_history WHERE user_id = :userID`,
        {
            replacements: {
                newReadme: JSON.stringify([newReadme]),
                userID: userID,
            },
        }
    );

    return newReadme;

}

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

const userHistory = {
    addNewArticle,
    addNewCustomPromptResponse,
    addNewDescription,
    addNewLandingPage,
    addNewLogo,
    addNewReadme,
    addNewSocialMediaAnnouncements
}

module.exports = userHistory;