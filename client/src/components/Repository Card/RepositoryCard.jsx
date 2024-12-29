import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import styles from "./RepositoryCard.module.css"

function RepositoryCard({ name, owner, updated_at }) {
    
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(`/repositories/${name}`, {
            state: { 
                repositoryName: name, 
                repositoryOwner: owner 
            }
        });
    }

    const formatedDate = formatDateTime(updated_at);

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
                    {name}
                </h1>
            </div>
            <div className={styles['stack']}>
                <span className="font-medium">Last updated:</span>&nbsp;{formatedDate}
            </div>  
        </div>
    )
}

function formatDateTime(isoString) {

    const date = new Date(isoString);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}, ${hours}:${minutes}`;

  }

export default RepositoryCard