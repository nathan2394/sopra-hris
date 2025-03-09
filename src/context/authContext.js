import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null); // Make sure this is not empty

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        const user = localStorage.getItem("userdata");
        if (token) {
            setIsAuthenticated(true);
            setUserData(user ? JSON.parse(user) : null);
        }
    }, []);

    const login = (token, data) => {
        localStorage.setItem("userToken", token);
        localStorage.setItem("statusAuth", "true");
        localStorage.setItem("userdata", JSON.stringify(data));
        localStorage.setItem("listContentMenu", JSON.stringify({parent: data?.parentMenus, child: data?.childMenus}));
        setIsAuthenticated(true);
        setUserData(data);
    };

    const logout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("statusAuth");
        localStorage.removeItem("userdata");
        setIsAuthenticated(false);
        setUserData(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
