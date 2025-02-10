const sequelize = require("./sequelize.js");
const { QueryTypes } = require('sequelize');

async function getUserMonthlyUsage(userID) {

    const currentMonthStartDate = getCurrentMonthStartDate();
    const currentMonthEndDate = getCurrentMonthEndDate();

    const transactions = await sequelize.query(
        `SELECT 
        transactions.element->>'date' AS date,
        (transactions.element->>'amount')::FLOAT AS amount
        FROM users,
        LATERAL jsonb_array_elements(users.user_transactions) AS transactions(element)
        WHERE users.user_id = :userID
        AND (transactions.element->>'date')::timestamp 
        BETWEEN :currentMonthStartDate AND :currentMonthEndDate;`,
        {
            replacements: { userID, currentMonthStartDate, currentMonthEndDate },
            type: QueryTypes.SELECT
        }
    );

    let monthlyUsageInUSD = 0;

    if (transactions.length > 0) {

        for (const transaction of transactions) {

            if (transaction.amount < 0) {
                monthlyUsageInUSD += Math.abs(transaction.amount);
                monthlyUsageInUSD = parseFloat((monthlyUsageInUSD.toFixed(1)));
            }
    
        }

    }

    return monthlyUsageInUSD;

}

function getCurrentMonthStartDate() {

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    return firstDay;

}

function getCurrentMonthEndDate() {

    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return lastDay;

}

module.exports = getUserMonthlyUsage;