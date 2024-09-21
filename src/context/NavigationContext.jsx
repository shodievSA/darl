import { useState, useEffect, useContext, createContext } from "react";

const MyContext = createContext();

export function NavigationContext({ children }) {

    const [currentNavigation, setCurrentNavigation] = useState(
        getNavigationType(window.innerWidth)
    );
    
    useEffect(() => {

        const handleResize = () => {
            const newNavigation = getNavigationType(window.innerWidth);
            if (newNavigation !== currentNavigation)
            {
                setCurrentNavigation(newNavigation);
            }
        }

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }

    }, [currentNavigation]);

    return (
        <MyContext.Provider value={{ currentNavigation }}>
            {children}
        </MyContext.Provider>
    )
}

export function useNavigationContext() {
    return useContext(MyContext);
}

const getNavigationType = (width) => {
    if (width > 1440) {
        return 'desktop';
    } else if (width > 834) {
        return 'laptop';
    } else {
        return 'mobile';
    }
};