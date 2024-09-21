import { useRef } from "react"
import styles from "./Logout.module.css"

function Logout() {
    const modelWindowRef = useRef(null);
    function deleteUserAccount(e) {
        e.preventDefault();
    }
    return (
        <div className={styles['page-container']}>
            <button 
            data-theme="halloween" 
            className={styles['delete-account-button']}
            onClick={() => modelWindowRef.current.showModal()}
            >
                Delete my account
            </button>
            <dialog 
            className={styles['modal-window']} 
            ref={modelWindowRef}
            >
                <div className={styles['popup-message']}>
                    <h3>Important!</h3>
                    <p className={styles['warning']}>
                        Are you sure you want to delete your account? 
                        Your data (e.g subscription and history) will 
                        be erased 30 days after you sign out.
                    </p>
                    <div className={styles['buttons-container']}>
                        <form method="dialog">
                            <button 
                            className={styles['cancel-button']}
                            >
                                Cancel
                            </button>
                        </form>
                        <form>
                            <button 
                            className={styles['confirm-button']}
                            onClick={deleteUserAccount}
                            >
                                Confirm
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default Logout