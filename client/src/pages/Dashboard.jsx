import React from "react";
import useAuth from "../features/auth/useAuth";

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#fafafa",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            color: "#000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "2rem"
        }}>
            <header style={{
                width: "100%",
                maxWidth: "800px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #e5e5e5",
                paddingBottom: "1.5rem",
                marginBottom: "3rem"
            }}>
                <div>
                    <h1 style={{ fontSize: "1.25rem", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase", margin: 0 }}>HabitGrid</h1>
                    <p style={{ fontSize: "0.8125rem", color: "#666", margin: "0.25rem 0 0 0" }}>Workspace of {user?.username}</p>
                </div>
                <button
                    onClick={logout}
                    style={{
                        backgroundColor: "#000",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        padding: "0.5rem 1rem",
                        fontSize: "0.8125rem",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "background-color 0.2s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#222"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#000"}
                >
                    Logout
                </button>
            </header>

            <main style={{ width: "100%", maxWidth: "800px" }}>
                <div style={{
                    background: "#fff",
                    border: "1px solid #e5e5e5",
                    borderRadius: "6px",
                    padding: "2.5rem",
                    textAlign: "center"
                }}>
                    <h2 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem" }}>Welcome back, {user?.username}</h2>
                    <p style={{ fontSize: "0.875rem", color: "#666", margin: 0 }}>Your HabitGrid is ready for tracking.</p>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
