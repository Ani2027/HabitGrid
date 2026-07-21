import React from "react";
import useAuth from "../features/auth/useAuth";

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-black flex flex-col items-center p-8">
            <header className="w-full max-w-[800px] flex justify-between items-center border-b border-gray-200 pb-6 mb-12">
                <div>
                    <h1 className="text-xl font-bold uppercase tracking-wider">HabitGrid</h1>
                    <p className="text-xs text-gray-500 mt-1">Workspace of {user?.username}</p>
                </div>
                <button
                    onClick={logout}
                    className="bg-black text-white text-xs font-medium px-4 py-2 rounded hover:bg-neutral-800 transition"
                >
                    Logout
                </button>
            </header>

            <main className="w-full max-w-[800px]">
                <div className="bg-white border border-gray-200 rounded-md p-10 text-center shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">Welcome back, {user?.username}</h2>
                    <p className="text-sm text-gray-500">Your HabitGrid workspace is ready.</p>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
