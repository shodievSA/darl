const { sequelize } = require("./models/user.js");
const getUserFreeTrials = require("./getUserFreeTrials.js");
const formatDate = require("../utils/formatDate.js");

async function addNewLogo(userID, repoName, logoQuantity) {

    const userFreeTrials = await getUserFreeTrials(userID);

    let newLogos = [];

    for (let i = 0; i < logoQuantity; i++) {

        const uniqueID = `${Date.now()}-${i}`;

        const newLogo = {
            value: `${userID}/${repoName}-${uniqueID}.png`,
            repoName: repoName,
            date: formatDate(),
            type: 'logo',
            price: userFreeTrials > 0 ? 'free trial' : 0.8
        }

        newLogos.push(newLogo);

    }

    await sequelize.query(
        `UPDATE users SET user_history = :newLogos || user_history WHERE user_id = :userID`,
        {
            replacements: {
                newLogos: JSON.stringify(newLogos),
                userID: userID,
            },
        }
    );

    return newLogos;

}

module.exports = addNewLogo;