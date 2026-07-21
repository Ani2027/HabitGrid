import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../features/auth/useAuth";
import AuthLayout from "../components/AuthLayout";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await register(username, email, password);
            navigate("/dashboard");
        } catch (err) {
            const msg = err.response?.data?.message || "Registration failed. Try again.";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout subtitle="Create your new workspace">
            <form onSubmit={handleSubmit}>
                <div className="input-field">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

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
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="btn-submit" disabled={isLoading}>
                    {isLoading && <div className="spinner" />}
                    {isLoading ? "Creating account..." : "Register"}
                </button>
            </form>

            <div className="auth-footer">
                Already have an account?
                <Link to="/login">Log in</Link>
            </div>
        </AuthLayout>
    );
};

export default Register;
