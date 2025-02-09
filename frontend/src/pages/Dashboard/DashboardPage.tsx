import React, { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { useNavigate, NavigateFunction } from "react-router-dom";

const DashboardPage: React.FC = () => {
    const user = useAuthStore((state) => state.user);
    const isLogged = useAuthStore((state) => state.isLogged);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Wallet | Dashboard";
    }, []);

    function handleLogout(navigate: NavigateFunction) {
        // clear state
        useAuthStore.getState().clearAuth();
        console.log("Auth state cleared.");

        // clear session storage
        sessionStorage.clear();
        console.log("Session storage cleared.");

        // redirect to login page
        navigate("/");
    }

    return (
        <div className='flex flex-col items-center justify-center h-screen text-blue-900'>
            <h1 className='text-3xl font-primary'>Dashboard</h1>
            <div className='flex justify-center items-center mt-10 gap-x-4'>
                <p className='text-xl font-primary'>Welcome to your dashboard, {user.given_name}!</p>
                <img
                    src={user.picture}
                    alt='User'
                    className='rounded-full size-11 drop-shadow-2xl shadow-red-600 border border-blue-900'
                    referrerPolicy='no-referrer'
                />
            </div>
            {isLogged ? (
                <p>
                    You are currently logged in. <button onClick={() => handleLogout(navigate)}>Log out?</button>
                </p>
            ) : (
                <p>You are currently not logged in.</p>
            )}
        </div>
    );
};

export default DashboardPage;
