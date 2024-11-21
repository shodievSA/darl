const User = require("./models/user.js");

async function addNewReadme(userID, newReadme, repoName) {

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const readme = {
        readme: newReadme,
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
        readmes: [readme, ...userHistory['readmes']] 
    };

    await User.update(
        { user_history: updatedUserHistory }, 
        { where: { user_id: userID } }
    );

}

module.exports = addNewReadme;