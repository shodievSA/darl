import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import styles from "./GeneratedLogo.module.css";
const serverIP = import.meta.env.VITE_SERVER_IP;

function GeneratedLogo() {

    const [downloadLink, setDownloadLink] = useState(null);

    const navigate = useNavigate();
    const { repositoryName } = useParams();
    const location = useLocation();
    const { logoPath } = location.state;

    function handleLogoDownload() {

        const link = document.createElement("a");
        link.href = downloadLink;
        link.download = "downloaded-image.png";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    }

    useEffect(() => {

        async function fetchLogo() {

            const res = await fetch(
                `${serverIP}/api/v1/generated-logo`, 
                { 
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        path: logoPath
                    })
                }
            );
            const data = await res.json();

            console.log(data)

            setDownloadLink(data.url);

        }

        fetchLogo();

    }, []);

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
                    <FontAwesomeIcon 
                    icon={faGithub}
                    className={styles['github-icon']}
                    />
                    <h1 className={styles['repository-name']}>
                        { repositoryName }
                    </h1>
                </div>
            </div>
            <div className={styles['main']}>
                <div className={styles['download-button-container']}>
                    {
                        downloadLink ? (
                            <button
                            onClick={handleLogoDownload}
                            data-theme="dark"
                            className={styles['download-logo-button']}
                            >
                            Download Logo
                            </button>
                        ) : (
                            <button
                            data-theme="dark"
                            className={styles['download-logo-button']}
                            >
                            Fetching the logo...
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    );

}

export default GeneratedLogo;