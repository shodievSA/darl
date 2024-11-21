import { useLocation, useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import styles from "./GeneratedLogo.module.css";

function GeneratedLogo() {

    const navigate = useNavigate();
    const { repositoryName } = useParams();
    const location = useLocation();
    const { logo } = location.state;

    console.log(logo)

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
                    <a href={`data:image/jpeg;base64,${logo}`} download={true}>
                        <button
                        data-theme="dark"
                        className={styles['download-logo-button']}>
                            Download Logo
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );

}

export default GeneratedLogo;