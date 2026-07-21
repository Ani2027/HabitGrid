import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../features/auth/useAuth";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                fontFamily: "sans-serif",
                fontSize: "0.875rem",
                color: "#999",
                backgroundColor: "#fff"
            }}>
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
