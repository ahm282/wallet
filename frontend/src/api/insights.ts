import { instantiateAPI } from "@/lib/api_utils";
import { getUserId } from "@/lib/utils";

export const fetchInsightsData = async () => {
    const userId = getUserId();
    const api = instantiateAPI("http://localhost:8083/api/v1/insights");
    return await api.get(`/analytics/${userId}`);
};

export const fetchCategoryInsights = async () => {
    const userId = getUserId();
    const api = instantiateAPI("http://localhost:8083/api/v1/insights");
    return await api.get(`/category/${userId}`);
};

export const fetchBudgetAnalytics = async () => {
    const userId = getUserId();
    const api = instantiateAPI("http://localhost:8083/api/v1/insights");
    return await api.get(`/budget/${userId}`);
};

export const fetchBillsAnalytics = async () => {
    const userId = getUserId();
    const api = instantiateAPI("http://localhost:8083/api/v1/insights");
    return await api.get(`/bills/${userId}`);
};

export const fetchAnomalies = async () => {
    const userId = getUserId();
    const api = instantiateAPI("http://localhost:8083/api/v1/insights/analytics");
    return await api.get(`/anomalies/${userId}`);
};

// export const fetchFinancialTrends = async (months: number = 6) => {
//     const userId = getUserId();
//     const api = instantiateAPI();
//     return await api.get(`/analytics/summary/${userId}?months=${months}`);
// };

// export const fetchSpendingByCategory = async (period: string = "monthly") => {
//     const userId = getUserId();
//     const api = instantiateAPI();
//     return await api.get(`/analytics/summary/${userId}?period=${period}`);
// };
