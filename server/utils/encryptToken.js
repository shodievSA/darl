require("dotenv").config;
const crypto = require("crypto");

function encryptToken(token) {

    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8');
    const cipher = crypto.createCipheriv('aes-256-ecb', key, null);
    
    let encryptedToken = cipher.update(token, 'utf8', 'hex');
    encryptedToken += cipher.final('hex');

    return encryptedToken;

}

module.exports = encryptToken;