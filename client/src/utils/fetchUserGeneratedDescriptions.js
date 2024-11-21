const serverIP = import.meta.env.VITE_SERVER_IP

async function fetchUserGeneratedDescriptions() {

    let res = await fetch(`http://${serverIP}:3000/api/v1/generated-descriptions`);
    let data = await res.json();

    return data;

}

export default fetchUserGeneratedDescriptions;