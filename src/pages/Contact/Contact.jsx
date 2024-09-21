import styles from "./Contact.module.css"

function Contact() {
    return (
        <div className={styles['page-container']}>
            <form>
                <input
                type="text"
                placeholder="Enter your email"
                className={styles['email-input']}
                name="user-email"
                />
                <textarea
                className={styles['problem-description-textarea']}
                placeholder="Describe your problem..."
                name="problem-description-textarea"
                ></textarea>
                <button
                data-theme="halloween"
                className={styles['submit-problem-button']}
                >
                    Submit
                </button>
            </form>
        </div>
    )
}

export default Contact