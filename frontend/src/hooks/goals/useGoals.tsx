// src/hooks/useGoals.ts
import { useApi } from "@/providers/ApiProvider";
import { getUserId, createGoalFromResponse } from "@/lib/utils";
import type { Goal } from "@/types/goals.types";

export const useGoals = () => {
    const api = useApi();

    const fetchGoals = async (): Promise<Goal[]> => {
        const userId = getUserId();
        const response = await api.get<Goal[]>(`/finance/goal?id=${userId}`);
        return response.map(createGoalFromResponse);
    };

    const createGoal = async (newGoal: Omit<Goal, "id">) => {
        return await api.post("/finance/goal", {
            ...newGoal,
            userId: getUserId(),
        });
    };

    const updateGoal = async (updatedGoal: Goal) => {
        return await api.patch(`/finance/goal?id=${updatedGoal.id}`, updatedGoal);
    };

    const deleteGoal = async (goalId: string) => {
        return await api.delete(`/finance/goal?id=${goalId}`);
    };

    return { fetchGoals, createGoal, updateGoal, deleteGoal };
};
