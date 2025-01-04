const serverIP = import.meta.env.VITE_SERVER_IP;

async function generateName({
    repositoryName, repositoryOwner, setName
}) {

    const res = await fetch(
        `${serverIP}/api/v1/name-generation/${repositoryName}/${repositoryOwner}`
    );

    if (!res.ok) {
        
        const data = await res.json();
        throw new Error(data.errorMessage);

    } else {
        
        const data = await res.json();
        setName(data.name);

    }
    
}

export default generateName;