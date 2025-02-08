const { User } = require("./models/user.js");

async function updateUserBalance(userID, amount) {

    const user = await User.findByPk(userID);
    let result = (user['user_balance'] + (amount)).toFixed(2);
    user['user_balance'] = result;

    await user.save();  

}

module.exports = updateUserBalance;