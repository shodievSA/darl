import { useNavigate } from "react-router-dom";
import { useNavigationContext } from "../../context/NavigationContext";
import styles from "./History.module.css";

function History() {

    const { currentNavigation } = useNavigationContext();

    const navigate = useNavigate();

    const handleRedirection = (segment) => {
        navigate(`/history${segment}`);
    }

    return (
        <div className={styles['page-container']}>
            {
                currentNavigation === "desktop" && (
                    <div className={styles['header']}>
                        <h1>History</h1>
                    </div>
                )
            }
            <div className={styles['main']}>
                <div className={styles['histories']}>
                    <div onClick={() => handleRedirection('/descriptions')}>
                        Descriptions
                    </div>
                    <div 
                    // onClick={() => handleRedirection('/logos')}
                    >
                        Logos
                    </div>
                    <div onClick={() => handleRedirection('/articles')}>
                        Articles
                    </div>
                    <div onClick={() => handleRedirection('/readmes')}>
                        READMEs
                    </div>
                </div>
            </div>
        </div>
    );
    
}

export default History;