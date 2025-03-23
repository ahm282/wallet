import { useApi } from "@/providers/ApiProvider";
import { getUserId } from "@/lib/utils";

export const useDashboardData = () => {
    const api = useApi();

    const fetchDashboardData = async () => {
        const userId = getUserId();
        return await api.get(`/insights/dashboard/${userId}?refresh=true`);
    };

    return { fetchDashboardData };
};
