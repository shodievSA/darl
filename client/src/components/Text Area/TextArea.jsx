import { useState, useRef } from "react";
import styles from "./TextArea.module.css";

function TextArea({ value, copy }) {

    const copyText = capitalizeFirstChar(copy);

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
                    isTextCopied ? `${copyText} Copied!` : `Copy ${copyText}`
                }
            </button>
        </div>
    );

}

function capitalizeFirstChar(str) {

    return str.charAt(0).toUpperCase() + str.slice(1);

}

export default TextArea;