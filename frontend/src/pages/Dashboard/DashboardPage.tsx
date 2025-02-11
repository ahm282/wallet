import React, { useEffect } from "react";
import Onboarding from "@/components/dashboard/Onboarding";

const DashboardPage: React.FC = () => {
    useEffect(() => {
        document.title = "Wallet | Dashboard";
    }, []);

    return <Onboarding />;
};

export default DashboardPage;
