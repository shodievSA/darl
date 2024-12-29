require("dotenv").config();
const { User } = require("../database/models/user.js");
const getRefreshToken = require("../database/getRefreshToken.js");
const encryptToken = require("./encryptToken.js");

async function refreshAccessToken(userID, req) {

    let refreshToken = await getRefreshToken(userID);
    
    let res = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: new URLSearchParams({

            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: "refresh_token",
            refresh_token: refreshToken

        }).toString()
    });

    let tokenData = await res.json();

    let newAccessToken = encryptToken(
        tokenData['access_token']
    );
    let newRefreshToken = encryptToken(
        tokenData['refresh_token']
    );

    await User.update(
        { access_token: newAccessToken, refresh_token: newRefreshToken },
        { where: { user_id: userID }}
    );

    const currentDate = Date.now(); 
    const refreshTokenExpiresIn = tokenData.refresh_token_expires_in * 1000;
    const accessTokenExpiresIn = tokenData.expires_in * 1000; 

    const refreshTokenExpirationDate = new Date(
        currentDate + refreshTokenExpiresIn - (1000 * 60 * 5)
    );
    const accessTokenExpirationDate = new Date(
        currentDate + accessTokenExpiresIn - (1000 * 60 * 5)
    );

    req.session.refreshTokenExpirationDate = refreshTokenExpirationDate;
    req.session.accessTokenExpirationDate = accessTokenExpirationDate;

}

module.exports = refreshAccessToken;