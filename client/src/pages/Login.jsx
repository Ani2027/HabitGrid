import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../features/auth/useAuth";
import AuthLayout from "../components/AuthLayout";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            const msg = err.response?.data?.message || "Invalid email or password.";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout subtitle="Log in to your workspace">
            <form onSubmit={handleSubmit}>
                <div className="input-field">
                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="input-field">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="btn-submit" disabled={isLoading}>
                    {isLoading && <div className="spinner" />}
                    {isLoading ? "Logging in..." : "Continue"}
                </button>
            </form>

            <div className="auth-footer">
                Don't have an account?
                <Link to="/register">Sign up</Link>
            </div>
        </AuthLayout>
    );
};

export default Login;
