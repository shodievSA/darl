const serverIP = import.meta.env.VITE_SERVER_IP;
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GenerationButton from "../../components/GenerationButton/GenerationButton";
import LoadingGenerationButton from "../../components/LoadingGenerationButton/LoadingGenerationButton";
import TextArea from "../../components/Text Area/TextArea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "./ArticleGeneration.module.css";

function ArticleGeneration() {

    const navigate = useNavigate();
    const location = useLocation();

    const { repositoryName, repositoryOwner } = location.state;

    const [
        isGenerateArticleButtonClicked,
        setIsGenerateArticleButtonClicked
    ] = useState(false);
    const [article, setArticle] = useState("");

    async function generateArticle() {

        setIsGenerateArticleButtonClicked(true);

        let res = await fetch(
            `${serverIP}/api/v1/article-generation/${repositoryName}/${repositoryOwner}`
        );
        
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done)
        {
            const { value, done: streamDone } = await reader.read();
            done = streamDone;

            const text = decoder.decode(value || new Uint8Array(), { stream: !done });

            setArticle((oldChunk) => oldChunk + text);
        }
    }

    return (
        <div className={styles['page-container']}>
            <div className={styles['header']}>
                <div>
                    <FontAwesomeIcon 
                    icon={faChevronLeft}
                    className={styles['go-back-icon']}
                    onClick={() => navigate(-1)}
                    />
                </div>
                <div>
                    <h1 className={styles['service-name']}>
                        Article Generation
                    </h1>
                </div>
            </div>
            <div className={styles['main']}>
                {
                    article.length > 0 ? (
                        <TextArea value={article} copy={"Article"} />
                    ) : (
                        isGenerateArticleButtonClicked ? (
                            <LoadingGenerationButton />
                        ) : (
                            <GenerationButton 
                            text={'Generate Article'}
                            onClick={generateArticle}
                            />
                        )
                    )
                }
            </div>
        </div>
    );

}

export default ArticleGeneration;