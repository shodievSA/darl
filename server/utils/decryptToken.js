require("dotenv").config();
const crypto = require("crypto");

function decryptToken(token) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8');
    const decipher = crypto.createDecipheriv(
        'aes-256-ecb', 
        key, 
        null
    );
    let decrypted = decipher.update(token, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

module.exports = decryptToken;