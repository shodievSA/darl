const { User } = require("./models/user.js");

async function getUserBalance(userID) {

    const user = await User.findOne({
        where: { user_id: userID },
        attributes: ["user_balance"]
    });

    return user['user_balance'];

}

module.exports = getUserBalance;