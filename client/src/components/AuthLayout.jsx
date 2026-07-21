import React from "react";
import "../features/auth/auth.form.scss";

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="brand-header">
                    <div className="brand-title">HabitGrid</div>
                    {subtitle && <div className="brand-subtitle">{subtitle}</div>}
                </div>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
