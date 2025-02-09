// RouteGuards.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";

// Renders the children if logged in; otherwise, redirects to home ("/")
export const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const isLogged = useAuthStore((state) => state.isLogged);
    return isLogged ? (
        children
    ) : (
        <Navigate
            to='/'
            replace
        />
    );
};

export const PublicRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const isLogged = useAuthStore((state) => state.isLogged);
    return !isLogged ? (
        children
    ) : (
        <Navigate
            to='/dashboard'
            replace
        />
    );
};
