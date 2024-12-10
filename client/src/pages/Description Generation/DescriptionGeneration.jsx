const serverIP = import.meta.env.VITE_SERVER_IP;
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import LoadingGenerationButton from "../../components/LoadingGenerationButton/LoadingGenerationButton";
import GenerationButton from "../../components/GenerationButton/GenerationButton";
import TextArea from "../../components/Text Area/TextArea";
import styles from "./DescriptionGeneration.module.css"

function DescriptionGeneration() {

    const location = useLocation();
    const navigate = useNavigate();

    const { repositoryName, repositoryOwner } = location.state;

    const [
        isGenerateDescriptionButtonClicked,
        setIsGenerateDescriptionButtonClicked
    ] = useState(false);
    const [description, setDescription] = useState("");

    async function generateDescription() {

        setIsGenerateDescriptionButtonClicked(true);

        let res = await fetch(
            `${serverIP}/api/v1/project-description/${repositoryName}/${repositoryOwner}`
        );

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done)
        {
            const { value, done: streamDone } = await reader.read();
            done = streamDone;

            const text = decoder.decode(value || new Uint8Array(), { stream: !done });

            setDescription((oldChunk) => oldChunk + text);
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
                    Description Generation
                </h1>
                </div>
            </div>
            <div className={styles['main']}>
                {
                    description.length > 0 ? (
                        <TextArea 
                        value={description} 
                        copy={"Description"} 
                        />
                    ) : (
                        isGenerateDescriptionButtonClicked ? (
                            <LoadingGenerationButton />
                        ) : (
                            <GenerationButton
                            text={"Generate Description"}
                            onClick={generateDescription}
                            />
                        )
                    )
                }
            </div>
        </div>
    )
}

export default DescriptionGeneration;