import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import GenerateDescriptionButton from "../../components/GenerateDescriptionButton/GenerateDescriptionButton"
import TextArea from "../../components/Text Area/TextArea"
import { useNavigationContext } from "../../context/NavigationContext"
import styles from "./Repository.module.css"

function Repository() {

    const [description, setDescription] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    const { repositoryName, repositoryOwner } = location.state;

    const handleRedirect = () => {
        navigate(-1)
    }

    const { currentNavigation } = useNavigationContext();

    async function generateDescription() {

        let res = await fetch(
            `http://localhost:3000/api/v1/project-description/${repositoryName}/${repositoryOwner}`
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
                <div onClick={handleRedirect}>
                    <FontAwesomeIcon 
                    icon={faChevronLeft} 
                    className={styles['go-back-icon']}
                    />
                </div>  
                {
                    (currentNavigation == "desktop" || currentNavigation == "laptop") && (
                        <div>
                            <FontAwesomeIcon 
                            icon={faGithub}
                            className={styles['github-icon']}
                            />
                            <h1 className={styles['repository-name']}>
                                {repositoryName}
                            </h1>
                        </div>
                    )
                }
            </div>
            <div className={styles['main']}>
                {
                    currentNavigation == "mobile" && (
                        <div>
                            <FontAwesomeIcon 
                            icon={faGithub}
                            className={styles['github-icon']}
                            />
                            <h1 className={styles['repository-name']}>
                                {repositoryName}
                            </h1>
                        </div>
                    )
                }
                {
                    description.length > 0 ? (
                        <TextArea 
                        description={description}
                        />
                    ) : (
                        <GenerateDescriptionButton propFunction={generateDescription} />
                    )
                }
            </div>
        </div>
    )
}

export default Repository