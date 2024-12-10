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

    function handleLogoDownload() {

        const link = document.createElement('a');
        link.href = logoURL;
        link.download = 'downloaded-image.png';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    }

    async function generateLogo() {

        setIsGenerateLogoButtonClicked(true);

        let res = await fetch(
            `${serverIP}/api/v1/generate-logo/${repositoryName}/${repositoryOwner}`, 
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
        let imageURL = data.url;

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
                        onClick={handleLogoDownload}
                        data-theme="dark"
                        className={styles['download-logo-button']}>
                            Download Logo
                        </button>
                    </div>
                )
            }
        </div>
    );
}

export default LogoGeneration