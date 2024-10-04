import { Outlet } from "react-router-dom";
import ResponsiveNavigation from "../Navigation/Navigation";
import styles from "./Layout.module.css";

function Layout() {
    return (
        <>
        <div className={styles['page-container']}>
            <ResponsiveNavigation  />
            <Outlet />
        </div>
        </>
    );
}

export default Layout
