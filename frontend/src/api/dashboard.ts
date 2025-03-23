import { getContextApi } from "@/lib/api_adapter";
import { getUserId } from "@/lib/utils";

export const fetchDashboardData = async () => {
    const userId = getUserId();
    const api = getContextApi();
    return await api.get(`/insights/dashboard/${userId}?refresh=true`);
};
