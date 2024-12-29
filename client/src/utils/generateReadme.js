const serverIP = import.meta.env.VITE_SERVER_IP;

async function generateReadme({
    repositoryName, repositoryOwner, setReadme
}) {

    const res = await fetch(
        `${serverIP}/api/v1/readme-generation/${repositoryName}/${repositoryOwner}`
    );

    if (!res.ok) {
        
        const data = await res.json();
        throw new Error(data.errorMessage);

    } else {

        const data = await res.json();
        setReadme(data.readme);

    }

}

export default generateReadme;