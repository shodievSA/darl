const { User } = require("./models/user.js");
const encryptToken = require("../utils/encryptToken.js");

async function updateUserTokens(userID, accessToken, refreshToken) {

    const encryptedAccessToken = encryptToken(accessToken);
    const encryptedRefreshToken = encryptToken(refreshToken);

    await User.update(
        { 
            access_token: encryptedAccessToken, 
            refresh_token: encryptedRefreshToken 
        },
        { where: { user_id: userID }}
    );

}

module.exports = updateUserTokens;