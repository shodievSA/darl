const { User } = require("./models/user");
const encryptToken = require("../utils/encryptToken.js");

async function registerNewUser(userID, accessToken, refreshToken) {
    let encryptedAccessToken = encryptToken(accessToken);
    let encryptedRefreshToken = encryptToken(refreshToken);
    await User.create({
        user_id: userID,
        access_token: encryptedAccessToken,
        refresh_token: encryptedRefreshToken
    });
}

module.exports = registerNewUser;