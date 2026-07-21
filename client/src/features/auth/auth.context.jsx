import React, { createContext, useState, useEffect, useCallback } from "react";
import { setAccessToken, clearAccessToken } from "../../api/axios.instance";
import { loginUser, registerUser, refreshAccessToken, getMe, logoutUser } from "./auth.service";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const { accessToken } = await refreshAccessToken();
                setAccessToken(accessToken);
                const { user: userData } = await getMe();
                setUser(userData);
            } catch (error) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        restoreSession();
    }, []);

    const login = useCallback(async (email, password) => {
        const data = await loginUser(email, password);
        setAccessToken(data.accessToken);
        setUser(data.user);
        return data;
    }, []);

    const register = useCallback(async (username, email, password) => {
        const data = await registerUser(username, email, password);
        setAccessToken(data.accessToken);
        setUser(data.user);
        return data;
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Logout failed on server", error);
        } finally {
            clearAccessToken();
            setUser(null);
        }
    }, []);

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
