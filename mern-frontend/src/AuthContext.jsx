import { createContext, useContext, useState, useEffect } from "react";

// Create AuthContext
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if user is logged in (Example: Using localStorage)
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token); 
    }, []);

    // ✅ Login function
    const login = (token) => {
        localStorage.setItem("token", token); // Store token
        setIsAuthenticated(true);
    };

    // ✅ Logout function
    const logout = () => {
        localStorage.removeItem("token"); // Remove token
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// ✅ Export `useAuth` hook
export const useAuth = () => {
    return useContext(AuthContext);
};
