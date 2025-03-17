import { instantiateAPI } from "@/lib/api_utils";
import { getUserId } from "@/lib/utils";
import type { Budget } from "@/types/budget.types";

export const fetchBudgets = async (): Promise<Budget[]> => {
    const userId = getUserId();
    const api = instantiateAPI();
    return await api.get<Budget[]>(`/finance/budget?id=${userId}`);
};

export const createBudget = async (newBudget: Omit<Budget, "id">) => {
    const api = instantiateAPI();
    return await api.post("/finance/budget", {
        ...newBudget,
        userId: getUserId(),
    });
};

export const updateBudget = async (updatedBudget: Budget) => {
    const api = instantiateAPI();
    return await api.patch(`/finance/budget?id=${updatedBudget.id}`, updatedBudget);
};

export const deleteBudget = async (budgetId: string) => {
    const api = instantiateAPI();
    return await api.delete(`/finance/budget?id=${budgetId}`);
};
