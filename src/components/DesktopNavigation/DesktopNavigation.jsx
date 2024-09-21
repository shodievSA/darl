import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeadset } from "@fortawesome/free-solid-svg-icons";
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { faFolderTree } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom"
import styles from "./DesktopNavigation.module.css"

function DesktopNavigation() {
    return (
        <div className={styles['menu']}>
            <ul className={styles['links']}>
                <li>
                    <NavLink 
                    to="/contact"
                    style={({ isActive }) => {
                        return  {
                            backgroundColor: isActive ? "#7a00c2" : ""
                        }
                    }}
                    >
                        <div>
                            <FontAwesomeIcon 
                            icon={faHeadset} 
                            className="h-6 w-6" 
                            />
                        </div>
                        <div>
                            Contact Us
                        </div>
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
                    >
                        <div>
                            <FontAwesomeIcon icon={faClockRotateLeft} className="h-6 w-6" />
                        </div>
                        <div>
                            View History
                        </div>
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
                    >
                        <div>
                            <FontAwesomeIcon icon={faDollarSign} className="h-6 w-6" />
                        </div>
                        <div>
                            Pricing Plans
                        </div>
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
                    >
                        <div>
                            <FontAwesomeIcon icon={faFolderTree} className="h-6 w-6" />
                        </div>
                        <div>
                            Repositories
                        </div>
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
                    >
                        <div>
                            <FontAwesomeIcon icon={faArrowRightFromBracket} className="h-6 w-6" />
                        </div>
                        <div>
                            Log Out
                        </div>
                    </NavLink>
                </li>
            </ul>
        </div>
    )
}

export default DesktopNavigation