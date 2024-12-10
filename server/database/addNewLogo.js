const User = require("./models/user.js");

async function addNewLogo(userID, newLogo, repoName) {

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const logo = {
        path: `${userID}/${repoName}-${Date.now()}.png`,
        repoName: repoName,
        generatedOn: formattedDate
    }

    const user = await User.findOne({
        where: { user_id: userID },
        attributes: ["user_history"]
    });

    const userHistory = user['user_history'];

    const updatedUserHistory = { 
        ...userHistory, 
        logos: [logo, ...userHistory['logos']] 
    };

    await User.update(
        { user_history: updatedUserHistory }, 
        { where: { user_id: userID } }
    );

    return logo.path;

}

module.exports = addNewLogo;