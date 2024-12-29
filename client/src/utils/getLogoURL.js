const serverIP = import.meta.env.VITE_SERVER_IP;

async function getLogoURL(logoPath) {

    const res = await fetch(`${serverIP}/api/v1/generated-logo`, { 
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            path: logoPath
        })
    });

    const data = await res.json();

    return data.url;
    
}

export default getLogoURL;