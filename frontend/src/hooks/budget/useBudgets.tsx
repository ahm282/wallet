import { useApi } from "@/providers/ApiProvider";
import { getUserId } from "@/lib/utils";
import type { Budget } from "@/types/budget.types";

export const useBudgets = () => {
    const api = useApi();

    const fetchBudgets = async (): Promise<Budget[]> => {
        const userId = getUserId();
        return await api.get<Budget[]>(`/finance/budget?id=${userId}`);
    };

    const createBudget = async (newBudget: Omit<Budget, "id">) => {
        return await api.post("/finance/budget", {
            ...newBudget,
            userId: getUserId(),
        });
    };

    const updateBudget = async (updatedBudget: Budget) => {
        return await api.patch(`/finance/budget?id=${updatedBudget.id}`, updatedBudget);
    };

    const deleteBudget = async (budgetId: string) => {
        return await api.delete(`/finance/budget?id=${budgetId}`);
    };

    return { fetchBudgets, createBudget, updateBudget, deleteBudget };
};
