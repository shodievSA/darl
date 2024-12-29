import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useNavigationContext } from "../../context/NavigationContext"
import TextArea from "../../components/Text Area/TextArea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import styles from "./HistoryItem.module.css";

function HistoryItem() {
    
    const location = useLocation();
    const navigate = useNavigate();

    const { currentNavigation } = useNavigationContext();
    const { repositoryName } = useParams();
    const { item } = location.state;

    return (
        <div className={styles['page-container']}>
            <div className={styles['header']}>
                {
                    (currentNavigation == "desktop"
                    ||
                    currentNavigation == "laptop") && (
                        <div onClick={() => navigate(-1)}>
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
                {                   
                    <TextArea 
                    value={item.value} 
                    copy={item.type} 
                    />
                }
            </div>
        </div>
    );

}

export default HistoryItem;