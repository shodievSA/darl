import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { useNavigationContext } from "../../context/NavigationContext";
import TextArea from "../../components/Text Area/TextArea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "./Description.module.css"

function Description() {

    const location = useLocation();
    const navigate = useNavigate();

    const { description, repositoryName } = location.state;

    const handleRedirection = () => {
        navigate(-1);
    }

    const { currentNavigation } = useNavigationContext();

    return (
            <div className={styles['page-container']}>
                <div className={styles['header']}>
                    <div onClick={handleRedirection}>
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
                    <TextArea 
                    description={description} 
                    />
                </div>
            </div>
    )
}

export default Description