import React from "react";

const AuthLayout = ({ children, subtitle }) => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-[#fafafa] font-sans p-6">
            <div className="bg-white border border-gray-200 rounded-md w-full max-w-[400px] p-10 shadow-sm">
                <div className="text-center mb-10">
                    <div className="text-lg font-bold tracking-[0.15em] uppercase text-black mb-2">HabitGrid</div>
                    {subtitle && <div className="text-xs text-gray-500 tracking-tight">{subtitle}</div>}
                </div>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
