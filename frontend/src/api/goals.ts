import { instantiateAPI } from "@/lib/api_utils";
import { getUserId, createGoalFromResponse } from "@/lib/utils";
import type { Goal } from "@/types/goals.types";

export const fetchGoals = async (): Promise<Goal[]> => {
    const userId = getUserId();
    const api = instantiateAPI();
    return (await api.get<Goal[]>(`/goal?id=${userId}`)).map(createGoalFromResponse);
};

export const createGoal = async (newGoal: Omit<Goal, "id">) => {
    const api = instantiateAPI();
    return await api.post("/goal", {
        ...newGoal,
        userId: getUserId(),
    });
};

export const updateGoal = async (updatedGoal: Goal) => {
    const api = instantiateAPI();
    return await api.patch(`/goal?id=${updatedGoal.id}`, updatedGoal);
};

export const deleteGoal = async (goalId: string) => {
    const api = instantiateAPI();
    return await api.delete(`/goal?id=${goalId}`);
};
