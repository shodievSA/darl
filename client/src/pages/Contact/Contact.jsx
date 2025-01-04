import { useState, useRef } from "react";
import submitUserMessage from "../../utils/submitUserMessage";
import styles from "./Contact.module.css";

function Contact() {

    const [userEmail, setUserEmail] = useState("");
    const [userText, setUserText] = useState("");
    const [isMessageBeingSubmitted, setIsMessageBeingSubmitted] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

    const dialogWindowRef = useRef(null);

    async function sendMessage(e) {

        e.preventDefault();

        setIsMessageBeingSubmitted(true);
        setPopupMessage(
            await submitUserMessage(userEmail, userText)
        );
        setIsMessageBeingSubmitted(false);
        dialogWindowRef.current.showModal();

        setUserEmail("");
        setUserText("");

    }

    return (
        <div className={styles['page-container']}>
            <dialog 
            id="my_modal_5" 
            className="modal modal-bottom sm:modal-middle"
            ref={dialogWindowRef}
            >
                <div className="modal-box">
                    <p className="py-4 text-center">{popupMessage}</p>
                    <div className="modal-action">
                    <form method="dialog">
                        <button className="btn rounded-md">OK</button>
                    </form>
                    </div>
                </div>
            </dialog>
            <form onSubmit={sendMessage}>
                <input
                type="email"
                autoComplete="off"
                placeholder="Enter your email"
                className={styles['email-input']}
                name="user-email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                />
                <textarea
                className={styles['problem-description-textarea']}
                placeholder="Describe your problem..."
                name="problem-description-textarea"
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                ></textarea>
                {
                    isMessageBeingSubmitted ? (
                        <button 
                        className={styles['loading-button']}
                        disabled={true}
                        >
                            <span className="loading loading-spinner"></span>
                        </button>
                    ) : (
                        (userEmail.length > 0 && userText.length > 0) ? (
                            <button
                            data-theme="halloween"
                            className={styles['submit-problem-button']}
                            >
                                Submit
                            </button>
                        ) : (
                            <button
                            disabled={true}
                            className={styles['submit-problem-button']}
                            >
                                Submit
                            </button>
                        )
                    )
                }
            </form>
        </div>
    );

}

export default Contact;