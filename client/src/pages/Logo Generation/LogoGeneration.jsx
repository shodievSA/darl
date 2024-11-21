const serverIP = import.meta.env.VITE_SERVER_IP;
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import GenerationButton from "../../components/GenerationButton/GenerationButton";
import LoadingGenerationButton from "../../components/LoadingGenerationButton/LoadingGenerationButton";
import styles from "./LogoGeneration.module.css";

function LogoGeneration() {

    const [resolution, setResolution] = useState(null);
    const [logoURL, setLogoURL] = useState(null);
    const [
        isGenerateLogoButtonClicked,
        setIsGenerateLogoButtonClicked
    ] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const { repositoryName, repositoryOwner } = location.state;

    function handleSelectResolution(e) {
        setResolution(e.target.value);
    }

    async function generateLogo() {

        setIsGenerateLogoButtonClicked(true);

        let res = await fetch(
            `http://${serverIP}:3000/api/v1/generate-logo/${repositoryName}/${repositoryOwner}`, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    resolution: resolution,
                })
            }
        );

        let data = await res.json();
        let imageURL = `data:image/png;base64,${data['b64URL']}`;

        setLogoURL(imageURL);
        
    }

    return (
        <div className={styles['page-container']}>
            {
                logoURL == null ? (
                    <>
                        <div className={styles['header']}>
                            <div>
                                <FontAwesomeIcon
                                icon={faChevronLeft}
                                className={styles['go-back-icon']}
                                onClick={() => navigate(-1)}
                                />
                            </div>
                            <div>
                                <h1 className={styles['service-name']}>Logo Generation</h1>
                            </div>
                        </div>
                        <div className={styles['main']}>
                            {
                                isGenerateLogoButtonClicked ? (
                                    <LoadingGenerationButton />
                                ) : (
                                    <>                                           
                                    <GenerationButton 
                                    text={"Generate Logo"}
                                    onClick={generateLogo}
                                    />
                                    </>
                                )
                            }        
                        </div>
                    </>
                ) : (
                    <div className={styles['download-button-container']}>
                        <button 
                        onClick={() => navigate(-2)}
                        data-theme="dark"
                        className={styles['download-logo-button']}>
                            <a href={logoURL} download={true}>Download Logo</a>
                        </button>
                    </div>
                )
            }
        </div>
    );
}

export default LogoGeneration