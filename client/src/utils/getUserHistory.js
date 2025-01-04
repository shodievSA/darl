const serverIP = import.meta.env.VITE_SERVER_IP;

async function getUserHistory(setUserHistory) {

    const res = await fetch(`${serverIP}/api/v1/user-history`);
    const data = await res.json();

    console.log(data);

    setUserHistory(data.history);

}

export default getUserHistory;