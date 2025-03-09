import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const NavigationContext = createContext(null);

export const NavigationProvider = ({ children }) => {
    const navigate = useNavigate(); // Get the navigation function

    return (
        <NavigationContext.Provider value={navigate}>
            {children}
        </NavigationContext.Provider>
    );
};

// Custom hook for using navigation
export const useNavigation = () => {
    return useContext(NavigationContext);
};