import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

/**
 * App Routes
 * ─────────────────────────────────────────────────────────
 * createBrowserRouter uses the HTML5 History API (pushState).
 * This means URLs like /dashboard are real URLs (not hash-based like /#/dashboard).
 *
 * Route types:
 *  → Public routes  : anyone can visit (Login, Register)
 *  → Protected routes : only logged-in users (Dashboard)
 *    wrapped in <ProtectedRoute> which checks isAuthenticated from AuthContext
 *
 * "/" → redirects to /login by default
 * We use <Navigate replace> so the "/" entry is replaced in history
 * (pressing back won't loop you back to "/")
 */
export const router = createBrowserRouter([
    {
        // Default route → redirect to /login
        path: "/",
        element: <Navigate to="/login" replace />,
    },
    {
        // Public route — accessible without login
        path: "/login",
        element: <Login />,
    },
    {
        // Public route — accessible without login
        path: "/register",
        element: <Register />,
    },
    {
        // Protected route — only accessible when isAuthenticated === true
        // ProtectedRoute handles redirect to /login if not authenticated
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
]);