import React, { useEffect } from "react";
import Onboarding from "@/components/dashboard/Onboarding";

const DashboardPage: React.FC = () => {
    /*
     * Sets the title of the page to " Dashboard | Wallet" when the component mounts
     */
    useEffect(() => {
        document.title = "Dashboard | Wallet";
    }, []);

    return <Onboarding />;
};

export default DashboardPage;
