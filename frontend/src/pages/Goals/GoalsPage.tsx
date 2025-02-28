import { useEffect } from "react";
import { NoGoals } from "@/components/goals/NoGoals";
import { GoalsDataExists } from "@/components/goals/GoalsDataExists";
import { instantiateAPI } from "@/lib/api_utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createGoalFromResponse, getUserId } from "@/lib/utils";
import type { Goal, GoalResponse } from "@/types/goals.types";

// Function to fetch goals
async function getGoalsDataByUserId(): Promise<Goal[]> {
    const userId = getUserId();
    const api = instantiateAPI("http://localhost:3000/api");
    return api.get<GoalResponse[]>("/finance/goal?id=" + userId).then((goals) => goals.map(createGoalFromResponse));
}

export const GoalsPage = () => {
    const queryClient = useQueryClient();

    // Query for fetching goals
    const {
        data: goals = [],
        isLoading,
        isError,
        error,
    } = useQuery<Goal[], Error>({
        queryKey: ["goals", getUserId()],
        queryFn: getGoalsDataByUserId,
    });

    // Mutation for deleting goals
    const deleteGoalMutation = useMutation({
        mutationFn: (goalId: string) => {
            const api = instantiateAPI("http://localhost:3000/api");
            return api.delete(`/finance/goal?id=${goalId}`);
        },
        onSuccess: () => {
            // Invalidate and refetch goals query after deletion
            queryClient.invalidateQueries({ queryKey: ["goals"] });
        },
    });

    // Mutation for updating goals
    const updateGoalMutation = useMutation({
        mutationFn: (updatedGoal: Goal) => {
            const api = instantiateAPI("http://localhost:3000/api");
            return api.patch(`/finance/goal?id=${updatedGoal.id}`, updatedGoal);
        },
        onSuccess: () => {
            // Invalidate and refetch goals query after update
            queryClient.invalidateQueries({ queryKey: ["goals"] });
        },
    });

    // Mutation for creating goals
    const createGoalMutation = useMutation({
        mutationFn: (newGoal: Omit<Goal, "id">) => {
            const api = instantiateAPI("http://localhost:3000/api");
            return api.post("/finance/goal", {
                ...newGoal,
                userId: getUserId(),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["goals"] });
        },
    });

    // Set page title
    useEffect(() => {
        document.title = "Goals | Wallet";
    }, []);

    // Handle loading state
    if (isLoading) {
        return <div className='flex justify-center items-center h-64'>Loading goals...</div>;
    }

    // Handle error state
    if (isError) {
        return (
            <div className='w-6/12 mx-auto p-4 mt-10 bg-red-100 text-red-600 font-primary text-center rounded-md'>
                Error fetching goals: {error.message}
            </div>
        );
    }

    return goals.length > 0 ? (
        <GoalsDataExists
            goals={goals}
            createGoalMutation={createGoalMutation}
            updateGoalMutation={updateGoalMutation}
            deleteGoalMutation={deleteGoalMutation}
        />
    ) : (
        <NoGoals
            goals={goals}
            createGoalMutation={createGoalMutation}
        />
    );
};

export default GoalsPage;
