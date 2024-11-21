const User = require("./models/user.js");

async function getUserHistory({ userID, generation }) {

    const generatedDescriptions = await User.findOne({
        where: { user_id: userID },
        attributes: ["user_history"]
    });

    return generatedDescriptions['user_history'][generation];

}

module.exports = getUserHistory;