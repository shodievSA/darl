const serverIP = import.meta.env.VITE_SERVER_IP;
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingGenerationButton from "../../components/LoadingGenerationButton/LoadingGenerationButton";
import GenerationButton from "../../components/GenerationButton/GenerationButton";
import TextArea from "../../components/Text Area/TextArea";
import styles from "./ReadmeGeneration.module.css";

function ReadmeGeneration() {

    const location = useLocation();

    const { repositoryName, repositoryOwner } = location.state;

    const [
        isGenerateReadmeButtonClicked,
        setIsGenerateReadmeButtonClicked
    ] = useState(false);
    const [readme, setReadme] = useState("");

    const navigate = useNavigate();

    async function generateReadme() {

        setIsGenerateReadmeButtonClicked(true);

        let res = await fetch(
            `http://${serverIP}:3000/api/v1/readme-generation/${repositoryName}/${repositoryOwner}`
        );

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done)
        {
            const { value, done: streamDone } = await reader.read();
            done = streamDone;

            const text = decoder.decode(value || new Uint8Array(), { stream: !done });

            setReadme((oldChunk) => oldChunk + text);
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
                        README.md Generation
                    </h1>
                </div>
            </div>
            <div className={styles['main']}>
                {
                    readme.length > 0 ? (
                        <TextArea value={readme} copy={"README.md"} />
                    ) : (
                        isGenerateReadmeButtonClicked ? (
                            <LoadingGenerationButton />
                        ) : (
                            <GenerationButton 
                            text={"Generate README.md"}
                            onClick={generateReadme}
                            />
                        )
                    )
                }
            </div>
        </div>
    );

}

export default ReadmeGeneration;