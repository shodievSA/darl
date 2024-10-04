import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-solid-svg-icons";
import styles from "./TextArea.module.css";

function TextArea({ description }) {

    const [ isTextCopied, setIsTextCopied ] = useState(false);

    const textareaRef = useRef(null);

    const copyDescription = () => {

        navigator.clipboard.writeText(textareaRef.current.value)
        .then(() => {
            setIsTextCopied(true);
        })
        .catch((err) => {
            console.log("Error occured! ", err);
        })

    }

    return (
        <div
        className={styles['textarea-container']}
        >
            <textarea
            className={styles['repository-description']}
            ref={textareaRef}
            value={description}
            readOnly
            ></textarea>
            <div 
            className={styles['copy-button-container']}
            onClick={copyDescription}
            >
            {
                isTextCopied ? (
                    <>
                        <button 
                        className={styles['copy-button']}
                        >
                            Copied!
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                        className={styles['copy-button']}
                        >
                            Copy Description
                        </button>
                        <FontAwesomeIcon 
                        icon={faClone} 
                        className={styles['copy-icon']}
                        />
                    </>
                )
            }
            </div>
        </div>
    );

}

export default TextArea;