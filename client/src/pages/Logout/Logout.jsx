import { useRef } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./Logout.module.css"

function Logout() {

    const navigate = useNavigate();
    const modelWindowRef = useRef(null);

    async function deleteUserAccount(e) {
        e.preventDefault();

        modelWindowRef.current.close();

        let res = await fetch("http://localhost:3000/api/v1/delete-user");

        if (res.status == 500)
        {
            let data = await res.text();
            console.log(data);
        } 
        else if (res.status == 200)
        {
            navigate('/registration', { replace: true });
        }
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