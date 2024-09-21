import { useLocation, useNavigate } from "react-router-dom"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import GenerateDescriptionButton from "../../components/GenerateDescriptionButton/GenerateDescriptionButton"
import { useNavigationContext } from "../../context/NavigationContext"
import styles from "./Repository.module.css"

function Repository() {
    const location = useLocation();
    const navigate = useNavigate()

    const { repositoryName } = location.state;

    const handleRedirect = () => {
        navigate(-1)
    }

    const { currentNavigation } = useNavigationContext();

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
                <GenerateDescriptionButton />
            </div>
        </div>
    )
}

export default Repository