import { useLocation, useNavigate } from "react-router-dom"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigationContext } from "../../context/NavigationContext"
import styles from "./Repository.module.css"

function Repository() {

    const location = useLocation();
    const navigate = useNavigate();

    const { repositoryName, repositoryOwner } = location.state;

    const goBack = () => {
        navigate(-1)
    }

    const handleRedirection = (route) => {

        navigate(`/${repositoryName}/${route}`, {
            state: {
                repositoryName: repositoryName,
                repositoryOwner: repositoryOwner
            }
        });
        
    }

    const { currentNavigation } = useNavigationContext();

    return (                         
        <div className={styles['page-container']}>
            <div className={styles['header']}>
                {
                    (currentNavigation == "desktop"
                    ||
                    currentNavigation == "laptop") && (
                        <div onClick={goBack}>
                            <FontAwesomeIcon 
                            icon={faChevronLeft} 
                            className={styles['go-back-icon']}
                            />
                        </div>  
                    )
                }
                {
                    (currentNavigation == "desktop") && (
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
            </div>
            <div className={styles['main']}>
                <div  
                className={styles['services']}
                >
                    <div 
                    onClick={() => handleRedirection('article-generation')}
                    >
                        <h1>Generate Article</h1>
                    </div>
                    <div 
                    onClick={() => handleRedirection('readme-generation')}>
                        <h1>Generate README.md</h1>
                    </div>
                    <div 
                    onClick={() => handleRedirection('logo-generation')}
                    >
                        <h1>Generate Logo</h1>
                    </div>
                    <div
                    onClick={() => handleRedirection('project-description')}
                    >
                        <h1>Generate Description</h1>
                    </div>
                </div>                 
            </div>
        </div>
    )
}

export default Repository