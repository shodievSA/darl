const serverIP = import.meta.env.VITE_SERVER_IP;

async function generateLogo({ 
    repositoryName, repositoryOwner, setLogoURL
}) {

    let res = await fetch(`${serverIP}/api/v1/generate-logo/${repositoryName}/${repositoryOwner}`);

    if (!res.ok) {

        const data = await res.json();
        throw new Error(data.errorMessage);

    } else {

        let data = await res.json();
        setLogoURL(data.url);
    }
    
}

export default generateLogo;