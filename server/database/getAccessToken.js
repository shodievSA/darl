require("dotenv").config();
const User = require("./models/user.js");
const decryptToken = require("../utils/decryptToken.js");

async function getUserAccessToken(userID) {
    let encryptedToken = await User.findOne({
        where: { user_id: userID },
        attributes: ['access_token']
    });
    encryptedToken = encryptedToken.dataValues.access_token;
    let token = decryptToken(encryptedToken);

    return token;
}

module.exports = getUserAccessToken;