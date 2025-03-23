import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "@/api/dashboard";
import { Onboarding } from "@/components/dashboard/Onboarding";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { useHasEntities } from "@/hooks/use-has-entities";

const DashboardPage: React.FC = () => {
    const { data, isLoading, isError, error } = useQuery<Object, Error>({
        queryKey: ["dashboardData"],
        queryFn: fetchDashboardData,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });

    const hasEntities = useHasEntities();

    /*
     * Sets the title of the page to " Dashboard | Wallet" when the component mounts
     */
    useEffect(() => {
        document.title = "Dashboard | Wallet";
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <div className='flex justify-center items-center font-primary text-center h-64'>Loading dashboard...</div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className='w-6/12 mx-auto p-4 mt-10 bg-red-100 text-red-600 font-primary text-center rounded-md'>
                Error fetching dashboard: {error.message}
            </div>
        );
    }

    if (!hasEntities.hasAccounts || !hasEntities.hasBudgets || !hasEntities.hasGoals || !hasEntities.hasTransactions) {
        return <Onboarding />;
    }

    return <Dashboard data={data} />;
};

export default DashboardPage;
