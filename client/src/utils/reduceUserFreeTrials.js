const serverIP = import.meta.env.VITE_SERVER_IP;

async function reduceUserFreeTrials() {

    const res = await fetch(`${serverIP}/api/v1/reduce-user-free-trials`, {
        method: "PATCH"
    });

    const data = await res.json();

    console.log(data.message);

}

export default reduceUserFreeTrials;