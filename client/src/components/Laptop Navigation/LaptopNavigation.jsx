import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react"
import styles from "./LaptopNavigation.module.css"

function LaptopNavigation() {
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
        width: isMenuActive ? 350 : 0, 
        backgroundColor: isMenuActive ? "rgb(18, 18, 18)" : "none"
    }

    useEffect(() => {
        const currentRoute = location.pathname;
        
        if (currentRoute == "/contact") {
            setCurrentPage("Contact Us")
        } else if (currentRoute == "/history") {
            setCurrentPage("History")
        } else if (currentRoute == "/pricing") {
            setCurrentPage("Pricing Plans")
        } else if (currentRoute == "/") {
            setCurrentPage("Repositories")
        } else if (currentRoute == "/logout") {
            setCurrentPage("Log Out")
        }
    }, []);
    
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
                <h1>{currentPage}</h1>
            </div>
        </div>
        <div 
        className={styles['menu-container']} 
        style={dynamicMenuContainerStyles}
        >
            <div style={dynamicMenuStyles}>
                <div className={styles['menu-header']}>
                    <h1>Menu</h1>
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
                            onClick={() => handleRedirection("Pricing Plans")}
                            >
                                Pricing Plans
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                            to="/"
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
            </div>
            <div onClick={handleMenu}></div>
        </div>
        </>
    )
}

export default LaptopNavigation