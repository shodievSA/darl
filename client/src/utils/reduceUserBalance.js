const serverIP = import.meta.env.VITE_SERVER_IP;

async function reduceUserBalance(reduceBy) {

    const res = await fetch(`${serverIP}/api/v1/reduce-user-balance`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            reduceBy
        })
    });

    const data = await res.json();

    console.log(data.message);

}

export default reduceUserBalance;