import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import styles from "./RepositoryCard.module.css"

function RepositoryCard() {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate("/canvas-deadline-notifier", {
            state: { repositoryName: "canvas-deadline-notifier" }
        });
    }
    return (
        <div 
        className={styles['repository-card']}
        onClick={handleRedirect}
        >
            <div>
                <FontAwesomeIcon 
                icon={faGithub}
                className={styles['github-icon']}
                />
                <h1 className={styles['repository-name']}>
                    Repository Name 
                </h1>
            </div>
            <div className={styles['last-commit']}>
                <h1>Updated last week</h1>
            </div>
        </div>
    )
}

export default RepositoryCard