import React, { useEffect } from "react";

const ProfilePage: React.FC = () => {
    useEffect(() => {
        document.title = "Wallet | Profile";
    }, []);

    return (
        <div className='flex justify-center items-center gap-4 flex-col'>
            <h1>Profile</h1>
        </div>
    );
};

export default ProfilePage;
