require("dotenv").config();

async function contactAdmin(props) {

    const { userID, userEmail, userText } = props;

    let res = fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            chat_id: process.env.CHAT_ID,

            text: `<b>User Email Address:</b> ${userEmail}\n\n` + 
                  `<b>Text:</b>\n\n${userText}\n\n` +
                  `<b>User ID:</b> ${userID}`,

            parse_mode: "HTML"
        })
    })

    return res;

}

module.exports = contactAdmin;