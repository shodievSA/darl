import { useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faLifeRing } from "@fortawesome/free-solid-svg-icons";
import { faFileCode } from "@fortawesome/free-regular-svg-icons";
import { NavLink } from "react-router-dom";
import styles from "./DesktopNavigation.module.css";
const serverIP = import.meta.env.VITE_SERVER_IP;

function DesktopNavigation() {

    const navigate = useNavigate();
    const modelWindowRef = useRef(null);

    async function deleteUserAccount(e) {

        e.preventDefault();

        modelWindowRef.current.close();

        let res = await fetch(`${serverIP}/api/v1/delete-user`);

        if (res.status == 500) {
            let data = await res.text();
            console.log(data);
        } else if (res.status == 200) {
            navigate('/registration', { replace: true });
        }

    }

    return (
        <>
        <div className={styles['menu']}>
            <h1 className={styles['project-name']}>D&middot;A&middot;R&middot;L</h1>
            <ul className={styles['links']}>
                <li>
                    <NavLink 
                    to="/contact"
                    className={({ isActive }) => isActive ? styles['active-link'] : "" }
                    >
                        <div>
                            <FontAwesomeIcon 
                            icon={faLifeRing} 
                            className="h-4 w-4" 
                            />
                        </div>
                        <div className={styles['page-name']}>
                            Support
                        </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                    to="/history"
                    className={({ isActive }) => isActive ? styles['active-link'] : "" }
                    >
                        <div>
                            <FontAwesomeIcon icon={faClockRotateLeft} className="h-4 w-4" />
                        </div>
                        <div className={styles['page-name']}>
                            History
                        </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                    to="/pricing"
                    className={({ isActive }) => isActive ? styles['active-link'] : "" }
                    >
                        <div>
                            <FontAwesomeIcon icon={faDollarSign} className="h-4 w-4" />
                        </div>
                        <div className={styles['page-name']}>
                            Balance
                        </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                    to="/repositories" 
                    className={({ isActive }) => isActive ? styles['active-link'] : "" }
                    >
                        <div>
                            <FontAwesomeIcon icon={faFileCode} className="h-4 w-4" />
                        </div>
                        <div className={styles['page-name']}>
                            Repositories
                        </div>
                    </NavLink>
                </li>
                <li onClick={() => modelWindowRef.current.showModal()}>
                    <a>
                        <div>
                            <FontAwesomeIcon icon={faArrowRightFromBracket} className="h-4 w-4" />
                        </div>
                        <div className={styles['page-name']}>
                            Log Out
                        </div>
                    </a>
                </li>
            </ul>
        </div>
        <dialog 
        className={styles['modal-window']} 
        ref={modelWindowRef}
        >
            <div className={styles['popup-message']}>
                <p className={styles['warning']}>
                    Are you sure you want to log out from your account? 
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
        </>
    )
}

export default DesktopNavigation