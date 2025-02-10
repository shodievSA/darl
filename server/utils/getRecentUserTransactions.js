const sequelize = require("../database/sequelize.js");
const { QueryTypes } = require('sequelize');
 
async function getRecentUserTransactions(userID) {

    const recentTransactions = await sequelize.query(
        `SELECT 
        jt->>'date' AS date,
        jt->>'amount' AS amount,
        jt->>'description' AS description
        FROM users, 
            jsonb_array_elements(user_transactions) AS jt
        WHERE user_id = :userID
        AND TO_TIMESTAMP(jt->>'date', 'YYYY-MM-DD, HH24:MI') >= NOW() - INTERVAL '7 days'
        ORDER BY TO_TIMESTAMP(jt->>'date', 'YYYY-MM-DD, HH24:MI') DESC
        LIMIT 5;
        `,
        { 
            replacements: { userID },
            type: QueryTypes.SELECT 
        }
    );

    return recentTransactions;

}

module.exports = getRecentUserTransactions;