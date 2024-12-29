const serverIP = import.meta.env.VITE_SERVER_IP;

async function getUserBalance(setUserBalance) {

    const res = await fetch(`${serverIP}/api/v1/user-balance`);
    const data = await res.json();

    setUserBalance(data.balance);

}

export default getUserBalance;