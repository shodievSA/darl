const User = require("./models/user.js");

async function addNewDescription(userID, newDescription, repoName) {

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const description = {
        description: newDescription,
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
        descriptions: [description, ...userHistory['descriptions']] 
    };

    await User.update(
        { user_history: updatedUserHistory }, 
        { where: { user_id: userID } }
    );

}

module.exports = addNewDescription;