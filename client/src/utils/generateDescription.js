const serverIP = import.meta.env.VITE_SERVER_IP;

async function generateDescription({
    repositoryName, repositoryOwner, setDescription
}) {

    const res = await fetch(
        `${serverIP}/api/v1/project-description/${repositoryName}/${repositoryOwner}`
    );

    if (!res.ok) {

        const data = await res.json();
        throw new Error(data.errorMessage);

    } else {

        const data = await res.json();
        setDescription(data.description);

    }
    
}

export default generateDescription;