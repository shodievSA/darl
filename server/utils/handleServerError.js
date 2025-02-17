require("dotenv").config();

async function handleServerError(props) {

    const { userInfo, error } = props;

    let res = fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            chat_id: process.env.CHAT_ID,

            text: `<b>User Info:</b> ${userInfo}\n\n` +
                `<b>Error:</b>\n\n${error}\n\n`,

            parse_mode: "HTML"
        })
    })

    return res;

}

module.exports = handleServerError;