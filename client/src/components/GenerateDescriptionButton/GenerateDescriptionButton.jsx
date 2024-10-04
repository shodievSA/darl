import { useState } from "react"
import styles from "./GenerateDescriptionButton.module.css"

function GenerateDescriptionButton({ propFunction }) {

    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const handleClick = () => {
        propFunction();
        setIsButtonClicked(!isButtonClicked)
    }
    return (
        <button 
        className={styles['generate-description-button']}
        onClick={handleClick}
        >
            {
                isButtonClicked ? (
                    <div className={styles['loading-state']}>
                        <span className={styles['loading-animation']}></span>
                    </div>
                ) : (
                    "Generate Description"
                )
            }
        </button>
    );

}

export default GenerateDescriptionButton