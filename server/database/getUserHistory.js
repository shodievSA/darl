const { User } = require("./models/user.js");

async function getUserHistory({ userID }) {

    const userHistory = await User.findOne({
        where: { user_id: userID },
        attributes: ["user_history"],
        raw: true
    });

    return userHistory['user_history'];

}

module.exports = getUserHistory;