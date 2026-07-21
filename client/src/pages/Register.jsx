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
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <label htmlFor="username" className="text-[12px] font-medium uppercase tracking-wider text-gray-500">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isLoading}
                        className="w-full text-sm px-3.5 py-3 border border-gray-200 rounded bg-transparent text-black outline-none transition focus:border-black focus:ring-1 focus:ring-black disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-gray-300"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-[12px] font-medium uppercase tracking-wider text-gray-500">
                        Email address
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="w-full text-sm px-3.5 py-3 border border-gray-200 rounded bg-transparent text-black outline-none transition focus:border-black focus:ring-1 focus:ring-black disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-gray-300"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-[12px] font-medium uppercase tracking-wider text-gray-500">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="w-full text-sm px-3.5 py-3 border border-gray-200 rounded bg-transparent text-black outline-none transition focus:border-black focus:ring-1 focus:ring-black disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-gray-300"
                    />
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded leading-relaxed">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 bg-black text-white rounded py-3 text-sm font-medium hover:bg-neutral-800 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading && (
                        <div className="w-3.5 h-3.5 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                    )}
                    {isLoading ? "Creating account..." : "Register"}
                </button>
            </form>

            <div className="text-center mt-8 text-xs text-gray-500">
                Already have an account?
                <Link to="/login" className="text-black font-semibold hover:underline ml-1">
                    Log in
                </Link>
            </div>
        </AuthLayout>
    );
};

export default Register;
