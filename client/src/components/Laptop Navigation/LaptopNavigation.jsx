import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { NavLink, useLocation } from "react-router-dom";
import styles from "./LaptopNavigation.module.css"
const serverIP = import.meta.env.VITE_SERVER_IP;

function LaptopNavigation() {

    const { repositoryName } = useParams();

    const modelWindowRef = useRef(null);

    const [isMenuActive, setIsMenuActive] = useState(false);
    const [currentPage, setCurrentPage] = useState();
    const location = useLocation();

    function handleMenu() {
        setIsMenuActive(!isMenuActive);
    }
    function handleRedirection(newPageName) {
        setIsMenuActive(!isMenuActive);
        setCurrentPage(newPageName)
    }
    const dynamicMenuContainerStyles = {
        display: isMenuActive ? "flex" : "none",
    }
    const dynamicMenuStyles = {
        width: isMenuActive ? 250 : 0, 
        backgroundColor: isMenuActive ? "rgb(12.5, 12.5, 12.5)" : "none"
    }

    async function deleteUserAccount(e) {
        e.preventDefault();

        modelWindowRef.current.close();

        let res = await fetch(`${serverIP}/api/v1/delete-user`);

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

    useEffect(() => {

        const currentRoute = location.pathname;
        
        if (currentRoute == "/contact") {
            setCurrentPage("Support")
        } else if (
            currentRoute == "/history" || 
            currentRoute == "/history/descriptions" || 
            currentRoute == "/history/articles" ||
            currentRoute == "/history/logos" || 
            currentRoute == "/history/readmes"
        ) {
            setCurrentPage("History")
        } else if (currentRoute == "/pricing") {
            setCurrentPage("Balance")
        } else if (currentRoute == "/repositories") {
            setCurrentPage("Repositories")
        } else if (currentRoute == "/logout") {
            setCurrentPage("Log Out")
        }

    }, [location.pathname]);
    
    return (
        <>
        <div className={styles['header']}>
            <div>
                <FontAwesomeIcon
                icon={faBars}
                className={styles['bars-icon']}
                onClick={handleMenu}
                />
            </div>
            <div>
                {
                    (location.pathname === `/repositories/${repositoryName}`) ? (
                        <div>
                            <FontAwesomeIcon 
                            icon={faGithub}
                            className={styles['github-icon']}
                            />
                            <h1 className={styles['repository-name']}>
                                {repositoryName}
                            </h1>
                        </div>
                    ) : (
                        <h1>{currentPage}</h1>
                    )
                }
            </div>
        </div>
        <div 
        className={styles['menu-container']} 
        style={dynamicMenuContainerStyles}
        >
            <div style={dynamicMenuStyles}>
                <div className={styles['menu-header']}>
                    <h1>D&middot;A&middot;R&middot;L</h1>
                    <FontAwesomeIcon
                    icon={faXmark}
                    onClick={handleMenu}
                    className={styles['hide-menu-icon']}
                    />
                </div>
                <div className={styles['menu-links-container']}>
                    <ul className={styles['links']}>
                        <li>
                            <NavLink
                            to="/contact"
                            style={({ isActive }) => {
                                return  {
                                    backgroundColor: isActive ? "#7a00c2" : ""
                                }
                            }}
                            onClick={() => handleRedirection("Contact Us")}
                            >
                                Support
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                            to="/history"
                            style={({ isActive }) => {
                                return  {
                                    backgroundColor: isActive ? "#7a00c2" : ""
                                }
                            }}
                            onClick={() => handleRedirection("History")}
                            >
                                History
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                            to="/pricing"
                            style={({ isActive }) => {
                                return  {
                                    backgroundColor: isActive ? "#7a00c2" : ""
                                }
                            }}
                            onClick={() => handleRedirection("Balance")}
                            >
                                Balance
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                            to="/repositories"
                            style={({ isActive }) => {
                                return  {
                                    backgroundColor: isActive ? "#7a00c2" : ""
                                }
                            }}
                            onClick={() => handleRedirection("Repositories")}
                            >
                                Repositories
                            </NavLink>
                        </li>
                        <li onClick={() => modelWindowRef.current.showModal()}>
                            <div>
                                Log Out
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div onClick={handleMenu}></div>
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

export default LaptopNavigation