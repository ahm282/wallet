import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NoGoals } from "@/components/goals/NoGoals";
import { GoalsDataExists } from "@/components/goals/GoalsDataExists";
import { getUserId } from "@/lib/utils";
import { fetchGoals, createGoal, updateGoal, deleteGoal } from "@/api/goals";
import type { Goal } from "@/types/goals.types";

export const GoalsPage = () => {
    const queryClient = useQueryClient();

    // Fetch goals
    const {
        data: goals = [],
        isLoading,
        isError,
        error,
    } = useQuery<Goal[], Error>({
        queryKey: ["goals", getUserId()],
        queryFn: fetchGoals,
    });

    // Mutation for creating goals
    const createGoalMutation = useMutation({
        mutationFn: (newGoal: Omit<Goal, "id">) => {
            return createGoal(newGoal);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["goals"] });
        },
    });

    // Mutation for updating goals
    const updateGoalMutation = useMutation({
        mutationFn: (updatedGoal: Goal) => {
            return updateGoal(updatedGoal);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["goals"] });
        },
    });

    // Mutation for deleting goals
    const deleteGoalMutation = useMutation({
        mutationFn: (goalId: string) => {
            return deleteGoal(goalId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["goals"] });
        },
    });

    /*
     * Sets the title of the page to "Goals | Wallet" when the component mounts
     */
    useEffect(() => {
        document.title = "Goals | Wallet";
    }, []);

    // Loading state
    if (isLoading) {
        return <div className='flex justify-center items-center h-64'>Loading goals...</div>;
    }

    // Error state
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
