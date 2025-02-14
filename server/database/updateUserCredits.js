const updateUserBalance = require("./updateUserBalance");
const saveTransaction = require("./saveTransaction");
const reduceUserFreeTrials = require("./reduceUserFreeTrials");
const getUserFreeTrials = require("./getUserFreeTrials");

async function updateUserCredits(props) {

    const { userID, amount, description } = props;
    const freeTrialsLeft = await getUserFreeTrials(userID);

    if (freeTrialsLeft > 0) {

        await reduceUserFreeTrials(userID);

    } else {

        await updateUserBalance(userID, amount);
        await saveTransaction({
            userID: userID,
            amount: amount,
            description: description
        });

    }

}

module.exports = updateUserCredits;