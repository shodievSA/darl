import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { NavLink, useLocation } from "react-router-dom";
import styles from "./LaptopNavigation.module.css"

function LaptopNavigation() {

    const { repositoryName } = useParams();

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
        width: isMenuActive ? 300 : 0, 
        backgroundColor: isMenuActive ? "rgb(18, 18, 18)" : "none"
    }

    useEffect(() => {

        const currentRoute = location.pathname;
        
        if (currentRoute == "/contact") {
            setCurrentPage("Contact Us")
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
            </div>
            <div onClick={handleMenu}></div>
        </div>
        </>
    )
}

export default LaptopNavigation