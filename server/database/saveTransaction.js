const sequelize = require("./sequelize.js");
const formatDate = require("../utils/formatDate.js");
const getUserFreeTrials = require("./getUserFreeTrials.js");

async function saveTransaction(transactionDetails) {

    const { userID, amount, description } = transactionDetails;

    const userFreeTrials = await getUserFreeTrials(userID);

    if (userFreeTrials === 0) {

        const newTransaction = {
            description: description,
            amount: amount,
            date: formatDate()
        }
    
        await sequelize.query(
            `UPDATE users SET user_transactions = :newTransaction || user_transactions WHERE user_id = :userID`,
            {
                replacements: {
                    newTransaction: JSON.stringify([newTransaction]),
                    userID: userID,
                },
            }
        );

    }

}

module.exports = saveTransaction;