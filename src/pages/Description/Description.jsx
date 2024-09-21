import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { useNavigationContext } from "../../context/NavigationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faClone } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "./Description.module.css"

function Description() {

    const [ isTextCopied, setIsTextCopied ] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const textareaRef = useRef(null);

    const { description, repositoryName } = location.state;

    const handleRedirection = () => {
        navigate(-1);
    }

    const copyDescription = () => {
        navigator.clipboard.writeText(textareaRef.current.value)
        .then(() => {
            setIsTextCopied(true);
        })
        .catch((err) => {
            console.log("Error occured! ", err);
        })
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
                    <div>
                        <textarea
                        className={styles['repository-description']}
                        ref={textareaRef}
                        value={description}
                        readOnly
                        ></textarea>
                        <div 
                        className={styles['copy-button-container']}
                        onClick={copyDescription}
                        >
                            {
                                isTextCopied ? (
                                    <>
                                        <button 
                                        className={styles['copy-button']}
                                        >
                                        Copied!
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button 
                                        className={styles['copy-button']}
                                        >
                                        Copy Description
                                        </button>
                                        <FontAwesomeIcon 
                                        icon={faClone} 
                                        className={styles['copy-icon']}
                                        />
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default Description