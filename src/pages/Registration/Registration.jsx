import GitHubIcon from "../../components/GitHub Logo/GitHubLogo";
import styles from "./Registration.module.css"

function authorizeUser() {
    alert("Authorization process started...");
}

function Registration() {
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
                        <div><GitHubIcon /></div>
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
