const serverIP = import.meta.env.VITE_SERVER_IP;

async function getUserFreeTrials(setFreeTrialsLeft) {

    const res = await fetch(`${serverIP}/api/v1/user-free-trials`);
    const data = await res.json();

    console.log(data.freeTrialsLeft)

    setFreeTrialsLeft(data.freeTrialsLeft);

}

export default getUserFreeTrials;