const getUserFreeTrials = require("../database/getUserFreeTrials");
const reduceUserFreeTrials = require("../database/reduceUserFreeTrials");
const updateUserBalance = require("../database/updateUserBalance");
const saveTransaction = require("../database/saveTransaction");

async function deductUserCredits(deductionDetails) {

    const { userID, deductionAmount, description } = deductionDetails;
    const freeTrialsLeft = await getUserFreeTrials(userID);

    if (freeTrialsLeft > 0) {

        await reduceUserFreeTrials(userID);

    } else {

        await updateUserBalance(userID, -deductionAmount);
        await saveTransaction({
            userID: userID,
            amount: -deductionAmount,
            description: description
        });

    }

}

module.exports = deductUserCredits;