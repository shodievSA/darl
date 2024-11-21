import styles from "./GenerationButton.module.css"

function GenerationButton({ text, onClick }) {

    return (
        <button 
        className={styles['generate-button']}
        onClick={onClick}
        >            
        { text }    
        </button>
    );

}

export default GenerationButton;