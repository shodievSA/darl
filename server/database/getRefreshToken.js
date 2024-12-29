const { User } = require("./models/user.js");
const decrypt = require("../utils/decryptToken.js");

async function getRefreshToken(userID) {

    let encryptedToken = await User.findOne({
        where: { user_id: userID },
        attributes: ["refresh_token"]
    });

    encryptedToken = decrypt(encryptedToken.dataValues.refresh_token);

    return encryptedToken;

}

module.exports = getRefreshToken;