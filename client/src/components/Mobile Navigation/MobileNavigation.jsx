import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "./MobileNavigation.module.css";

function MobileNavigation() {

    const { repositoryName } = useParams();
    const navigate = useNavigate();

    const [pageName, setPageName] = useState(null);
    const [isMenuActive, setIsMenuActive] = useState(false);

    const headerRef = useRef(null);
    const checkBoxRef = useRef(null);

    const route = useLocation();

    function handleRedirection(pageName) {
        checkBoxRef.current.click();
        setPageName(pageName);
        setIsMenuActive(false);
    }

    function handleMenu() {
        setIsMenuActive(!isMenuActive);
    }

    useEffect(() => {
        const currentRoute = route.pathname;
        if (currentRoute == "/contact") {
            setPageName("Contact Us")
        } else if (currentRoute == "/history") {
            setPageName("History")
        } else if (currentRoute == "/pricing") {
            setPageName("Balance")
        } else if (currentRoute == "/repositories") {
            setPageName("Repositories")
        } else if (currentRoute == "/logout") {
            setPageName("Log Out")
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
                            (route.pathname === `/history/descriptions`)
                            ||
                            (route.pathname === `/history/logos`)
                            || 
                            (route.pathname === `/history/articles`) 
                            ||
                            (route.pathname === `/history/readmes`) ? (
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
                                Contact Us
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
                            <NavLink
                            to="/logout"
                            style={({ isActive }) => {
                                return  {
                                    backgroundColor: isActive ? "#7a00c2" : ""
                                }
                            }}
                            onClick={() => handleRedirection("Log Out")}
                            >
                                Log Out
                            </NavLink>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}

export default MobileNavigation;