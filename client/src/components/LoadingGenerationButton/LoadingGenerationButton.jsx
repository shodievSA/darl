import styles from "./LoadingGenerationButton.module.css";

function LoadingGenerationButton() {

    return (
        <button 
        className={styles['loading-button']}
        >          
            <progress className="progress w-52" />   
        </button>
    );

}

export default LoadingGenerationButton;