async function getUserInfo(accessToken) {
    let res = await fetch("https://api.github.com/user", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    });

    let data = await res.json();
    return data;
}

module.exports = getUserInfo;