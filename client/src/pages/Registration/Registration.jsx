import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import styles from "./Registration.module.css";

function Registration() {
    function authorizeUser() {
        const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`;
    }
    return (
        <>
        <div className={styles['page-container']}>
            <div className={styles['service-description']}>
                <h1>Generate professional descriptions of projects for your CV</h1>
            </div>
            <div className={styles['sign-in']}>
                <button 
                data-theme="halloween" 
                className={styles['sign-in-button']}
                onClick={authorizeUser}
                >
                    <div>
                        <div>
                            <FontAwesomeIcon 
                            icon={faGithub} 
                            className={styles['github-icon']}
                            />
                        </div>
                        <div>Sign in with GitHub</div>
                    </div>
                </button>
                <p className={styles['important']}>
                    We will need to get access to your public repositories 
                    to generate descriptions. We will be permitted to only 
                    “read” your projects.
                </p>
            </div>
        </div>
        </>
    );
}

export default Registration
