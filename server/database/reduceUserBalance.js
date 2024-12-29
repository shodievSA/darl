const { User } = require("./models/user.js");

async function reduceUserBalance(userID, reduceBy) {

    const user = await User.findByPk(userID);

    let result = (user['user_balance'] - reduceBy).toFixed(2);

    user['user_balance'] = result;
    await user.save();

}

module.exports = reduceUserBalance;