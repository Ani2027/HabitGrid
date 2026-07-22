import React from "react";
import useAuth from "../features/auth/useAuth"

const DashboardLayout = ({ children }) => {
    const { user, logout } = useAuth(); // gets user and logout function from useAuth hook

    return (
        <div className="flex h-screen w-screen bg-[#fafafa] font-sans text-black overflow-hidden">

            {/* SideBar Container */}
            <aside className="w-52 h-full bg-white border-r border-gray-200 flex flex-col justify-between p-6 z-10">

                {/* Top Section : Logo + Navigation */}
                <div>
                    {/* Logo */}
                    <div className="text-md font-bold tracking-[0.15em] uppercase text-black mb-8 px-2">
                        HabitGrid
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-1.5">
                        <a href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-black hover:bg-grey-50 px-3 py-2 rounded-md transition">
                            Dashboard
                        </a>

                        <a href="/habits" className="text-sm font-medium text-gray-500 hover:text-black hover:bg-grey-50 px-3 py-2 rounded-md transition">
                            My Habits
                        </a>

                        <a href="/settings" className="text-sm font-medium text-gray-500 hover:text-black hover:bg-grey-50 px-3 py-2 rounded-md transition">
                            Settings
                        </a>
                    </nav>
                </div>

                {/* Bottom Section : Logout */}
                <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
                    <div classname="px-2">
                        <div className="text-xs font-semibold text-black truncate">{user?.username}</div>
                        <div className="text-[10px] text-gray-400 truncate">{user?.email}</div>
                    </div>
                    <button onClick={logout} className="w-full text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 px py-2 rounded transition">
                        Sign Out
                    </button>
                </div>
            </aside>
            
            {/* Main Content Container */}
            <main className="flex-1 overflow-y-auto p-10">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;