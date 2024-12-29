const getUserFreeTrials = require("../database/getUserFreeTrials");
const reduceUserFreeTrials = require("../database/reduceUserFreeTrials");
const reduceUserBalance = require("../database/reduceUserBalance");

async function manageUserBalance(userID, reduceBy) {

    const freeTrialsLeft = await getUserFreeTrials(userID);

    if (freeTrialsLeft > 0) {

        await reduceUserFreeTrials(userID);

    } else {

        await reduceUserBalance(userID, reduceBy);

    }

}

module.exports = manageUserBalance;