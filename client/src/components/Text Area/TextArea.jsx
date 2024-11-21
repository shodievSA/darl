import { useState, useRef } from "react";
import styles from "./TextArea.module.css";

function TextArea({ value, copy }) {

    const [isTextCopied, setIsTextCopied] = useState(false);

    const textareaRef = useRef(null);

    const copyTextAreaValue = async () => {

        try {

            await navigator.clipboard.writeText(textareaRef.current.value);
            setIsTextCopied(true);

        } catch (err) {

            console.log("Error occured! ", err);

        }

    }

    return (
        <div
        className={styles['textarea-container']}
        >
            <textarea
            className={styles['repository-description']}
            ref={textareaRef}
            value={value}
            readOnly
            ></textarea>
            <button
            data-theme="halloween" 
            className={styles['copy-button']}
            onClick={copyTextAreaValue}
            >
                {
                    isTextCopied ? `${copy} Copied!` : `Copy ${copy}`
                }
            </button>
        </div>
    );

}

export default TextArea;