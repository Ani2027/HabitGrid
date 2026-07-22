import React from "react";
import useAuth from "../features/auth/useAuth";
import DashboardLayout from "../components/DashboardLayout";

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <DashboardLayout>
            <div className="bg-white border border-gray-200 rounded-md p-10 shadow-sm max-w-[800px]">
                <h2 className="text-lg font-semibold mb-2">Welcome back, {user?.name}!</h2>
                <p className="text-sm text-greay-500">This is your dashboard where you can manage your habits and track your progress.</p>
            </div>
        </DashboardLayout>
        
    );
};

export default Dashboard;
