const serverIP = import.meta.env.VITE_SERVER_IP

async function submitUserMessage(email, text) {

    let res = await fetch(`${serverIP}/api/v1/report-problem`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, text})
    });

    let message = await res.text();

    if (res.status == 200) {
        return message;
    } else if (res.status == 500) {
        return message;
    } else if (res.status == 429) {
        return message;
    } else {
        return message;
    }

}

export default submitUserMessage;