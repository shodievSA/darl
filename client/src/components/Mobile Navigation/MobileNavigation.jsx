import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "./MobileNavigation.module.css";
const serverIP = import.meta.env.VITE_SERVER_IP;

function MobileNavigation() {

    const { repositoryName } = useParams();
    const navigate = useNavigate();

    const [pageName, setPageName] = useState(null);
    const [isMenuActive, setIsMenuActive] = useState(false);

    const headerRef = useRef(null);
    const checkBoxRef = useRef(null);
    const modelWindowRef = useRef(null);

    const route = useLocation();

    function handleRedirection(pageName) {
        checkBoxRef.current.click();
        setPageName(pageName);
        setIsMenuActive(false);
    }

    function handleMenu() {
        setIsMenuActive(!isMenuActive);
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
        const currentRoute = route.pathname;
        if (currentRoute == "/contact") {
            setPageName("Support");
        } else if (currentRoute == "/history") {
            setPageName("History");
        } else if (currentRoute == "/pricing") {
            setPageName("Balance");
        } else if (currentRoute == "/repositories") {
            setPageName("Repositories");
        } else if (currentRoute == "/logout") {
            setPageName("Log Out");
        }
    }, [route.pathname]);

    useEffect(() => {
        if (isMenuActive) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
    }, [isMenuActive])

    return (
        <>
        <div 
        className={styles['header']} 
        style={{ height: isMenuActive ? "100%": "80px" }}
        ref={headerRef}
        >
            <div>                  
                <h1 className={styles['page-name']}>
                    {
                        isMenuActive ? (
                            "Menu" 
                        ) : (
                            (route.pathname === `/repositories/${repositoryName}`) 
                            ||
                            (route.pathname === `/history/${repositoryName}`) ? (
                                <FontAwesomeIcon 
                                icon={faChevronLeft} 
                                onClick={() => navigate(-1)}
                                />
                            ) : (
                                pageName
                            )
                        )
                    }
                </h1>                 
                <label className="btn swap swap-rotate px-0">
                    <input 
                    type="checkbox" 
                    onClick={handleMenu} 
                    ref={checkBoxRef}
                    />
                    <FontAwesomeIcon 
                    icon={faBars} 
                    className="h-7 w-7 swap-off fill-current"
                    />
                    <FontAwesomeIcon 
                    icon={faXmark} 
                    className="h-8 w-8 swap-on fill-current"
                    />
                </label>
            </div>
            { isMenuActive && (
                <div>
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
                        <li>
                            <div onClick={() => modelWindowRef.current.showModal()}>
                                Log Out
                            </div>
                        </li>
                    </ul>
                </div>
            )}
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

export default MobileNavigation;