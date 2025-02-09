import React from "react";
import useAuthStore from "@/store/authStore";

const DashboardPage: React.FC = () => {
    const token = useAuthStore((state) => state.token);

    return (
        <div className='flex flex-col items-center justify-center h-screen text-blue-900'>
            <h1 className='text-3xl font-primary'>Dashboard</h1>
            <p className='text-xl font-primary'>Welcome to your dashboard!</p>
        </div>
    );
};

export default DashboardPage;
