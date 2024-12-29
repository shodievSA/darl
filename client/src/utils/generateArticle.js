const serverIP = import.meta.env.VITE_SERVER_IP;

async function generateArticle({
    repositoryName, repositoryOwner, setArticle
}) {

    const res = await fetch(
        `${serverIP}/api/v1/article-generation/${repositoryName}/${repositoryOwner}`
    );

    if (!res.ok) {

        const data = await res.json();
        throw new Error(data.errorMessage);

    } else {

        const data = await res.json();
        setArticle(data.article);

    }

}

export default generateArticle;