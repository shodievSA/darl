import { useLocation, useNavigate, useParams } from "react-router-dom";
import TextArea from "../../components/Text Area/TextArea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import styles from "./GeneratedArticle.module.css";

function GeneratedArticle() {

    const location = useLocation();
    const navigate = useNavigate();

    const { repositoryName } = useParams();
    const { article } = location.state;

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
                <TextArea value={article} copy={"Article"} />
            </div>
        </div>
    );

}

export default GeneratedArticle;