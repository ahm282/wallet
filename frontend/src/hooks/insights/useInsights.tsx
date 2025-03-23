import { useApi } from "@/providers/ApiProvider";
import { getUserId } from "@/lib/utils";

export const useInsights = () => {
    const api = useApi();

    const fetchInsightsData = async () => {
        const userId = getUserId();
        return await api.get(`/insights/analytics/${userId}`);
    };

    const fetchCategoryInsights = async () => {
        const userId = getUserId();
        return await api.get(`/insights/category/${userId}`);
    };

    const fetchBudgetAnalytics = async () => {
        const userId = getUserId();
        return await api.get(`/insights/budget/${userId}`);
    };

    const fetchBillsAnalytics = async () => {
        const userId = getUserId();
        return await api.get(`/insights/bills/${userId}`);
    };

    const fetchAnomalies = async () => {
        const userId = getUserId();
        return await api.get(`/insights/anomalies/${userId}`);
    };

    return {
        fetchInsightsData,
        fetchCategoryInsights,
        fetchBudgetAnalytics,
        fetchBillsAnalytics,
        fetchAnomalies,
    };
};
