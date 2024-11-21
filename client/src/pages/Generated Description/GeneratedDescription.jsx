import { useLocation, useParams, useNavigate } from "react-router-dom";
import TextArea from "../../components/Text Area/TextArea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import styles from "./GeneratedDescription.module.css";

function GeneratedDescription() {

    const location = useLocation();
    const navigate = useNavigate();

    const { repositoryName } = useParams();
    const { description } = location.state;

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
                <TextArea value={description} copy={"Description"} />
            </div>
        </div>
    )
}

export default GeneratedDescription;