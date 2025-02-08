const { User } = require("../database/models/user");

async function getUserTransactions(userID) {

    const transactions = await User.findByPk(userID, {
        attributes: ["user_transactions"],
        raw: true
    });

    return transactions["user_transactions"];

}

module.exports = getUserTransactions;