const getUserBalance = require("../database/getUserBalance");
const getUserFreeTrials = require("../database/getUserFreeTrials");
const priceList = require("../utils/price-list");

function checkUserBalance(service) {

    return async (req, res, next) => {

        const userID = req.session.userID;

        const userFreeTrials = await getUserFreeTrials(userID);
        const userBalance = await getUserBalance(userID);

        if (userFreeTrials > 0 || userBalance >= priceList[service]) {

            next();

        } else {

            res.status(403).json({
                errorMessage: `Looks like you don't enough funds in your balance. Current balance - $${userBalance}. ` +
                              `\n\nPlease top up your balance to use the service.`
            }); 

        }

    }

}

const customMiddleware = {
    checkUserBalance
}

module.exports = customMiddleware;