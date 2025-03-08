import { instantiateAPI } from "@/lib/api_utils";
import { getUserId } from "@/lib/utils";

export const fetchDashboardData = async () => {
    const userId = getUserId();
    const api = instantiateAPI();
    return await api.get(`/finance/insights/dashboard/${userId}?refresh=true`);
};
