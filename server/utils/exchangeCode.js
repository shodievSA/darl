require('dotenv').config();

async function exchangeCode(code) {
    let res = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: code
        }).toString()
    });
    
    let data = await res.json();
    return data;
}

module.exports = exchangeCode;