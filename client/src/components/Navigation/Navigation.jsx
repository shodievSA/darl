import MobileNavigation from "../Mobile Navigation/MobileNavigation";
import LaptopNavigation from "../Laptop Navigation/LaptopNavigation";
import DesktopNavigation from "../DesktopNavigation/DesktopNavigation";
import { useNavigationContext } from "../../context/NavigationContext";

function ResponsiveNavigation() {

    const { currentNavigation } = useNavigationContext();

    return (
        <>
            { currentNavigation == "desktop" && <DesktopNavigation /> }
            { currentNavigation == "laptop" && <LaptopNavigation /> }
            { currentNavigation == "mobile" && <MobileNavigation /> }
        </>
    )
}

export default ResponsiveNavigation