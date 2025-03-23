import { getContextApi } from "@/lib/api_adapter";
import { getUserId, createGoalFromResponse } from "@/lib/utils";
import type { Goal } from "@/types/goals.types";

export const fetchGoals = async (): Promise<Goal[]> => {
    const userId = getUserId();
    const api = getContextApi();
    return (await api.get<Goal[]>(`/finance/goal?id=${userId}`)).map(createGoalFromResponse);
};

export const createGoal = async (newGoal: Omit<Goal, "id">) => {
    const api = getContextApi();
    return await api.post("/finance/goal", {
        ...newGoal,
        userId: getUserId(),
    });
};

export const updateGoal = async (updatedGoal: Goal) => {
    const api = getContextApi();
    return await api.patch(`/finance/goal?id=${updatedGoal.id}`, updatedGoal);
};

export const deleteGoal = async (goalId: string) => {
    const api = getContextApi();
    return await api.delete(`/finance/goal?id=${goalId}`);
};
