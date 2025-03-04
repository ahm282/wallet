import { instantiateAPI } from "@/lib/api_utils";
import { getUserId } from "@/lib/utils";

export const fetchDashboardData = async () => {
    const userId = getUserId();
    const api = instantiateAPI("http://localhost:8083/api/v1");
    return await api.get(`/insights/dashboard/${userId}?refresh=true`);
};
