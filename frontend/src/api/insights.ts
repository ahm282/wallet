import { getContextApi } from "@/lib/api_adapter";
import { getUserId } from "@/lib/utils";

export const fetchInsightsData = async () => {
    const userId = getUserId();
    const api = getContextApi();
    return await api.get(`/insights/analytics/${userId}`);
};

export const fetchCategoryInsights = async () => {
    const userId = getUserId();
    const api = getContextApi();
    return await api.get(`/insights/category/${userId}`);
};

export const fetchBudgetAnalytics = async () => {
    const userId = getUserId();
    const api = getContextApi();
    return await api.get(`/insights/budget/${userId}`);
};

export const fetchBillsAnalytics = async () => {
    const userId = getUserId();
    const api = getContextApi();
    return await api.get(`/insights/bills/${userId}`);
};

export const fetchAnomalies = async () => {
    const userId = getUserId();
    const api = getContextApi();
    return await api.get(`/insights/anomalies/${userId}`);
};

// Future implementations
// export const fetchFinancialTrends = async (months: number = 6) => {
//     const userId = getUserId();
//     const api = getContextApi();
//     return await api.get(`/analytics/summary/${userId}?months=${months}`);
// };

// export const fetchSpendingByCategory = async (period: string = "monthly") => {
//     const userId = getUserId();
//     const api = getContextApi();
//     return await api.get(`/analytics/summary/${userId}?period=${period}`);
// };
