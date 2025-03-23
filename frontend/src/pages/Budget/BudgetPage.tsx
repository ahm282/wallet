import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NoBudget } from "@/components/budget/NoBudget";
import { BudgetDataExists } from "@/components/budget/BudgetDataExists";
import { fetchBudgets, createBudget, updateBudget, deleteBudget } from "@/api/budgets";
import { getUserId } from "@/lib/utils";
import type { Budget } from "@/types/budget.types";

export const BudgetPage = () => {
    const queryClient = useQueryClient();

    const {
        data: budgets = [],
        isLoading,
        isError,
        error,
    } = useQuery<Budget[], Error>({ queryKey: ["budgets", getUserId()], queryFn: fetchBudgets });

    // Mutation for adding a budget
    const createBudgetMutation = useMutation({
        mutationFn: async (newBudget: Omit<Budget, "id">) => {
            return createBudget(newBudget);
        },
        onSuccess: () => {
            // Invalidate budgets query to refetch data
            queryClient.invalidateQueries({ queryKey: ["budgets", getUserId()] });
        },
    });

    // Mutation for updating a budget
    const updateBudgetMutation = useMutation({
        mutationFn: async (updatedBudget: Budget) => {
            return updateBudget(updatedBudget);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgets", getUserId()] });
        },
    });

    // Mutation for deleting a budget
    const deleteBudgetMutation = useMutation({
        mutationFn: async (budgetId: string) => {
            return deleteBudget(budgetId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgets", getUserId()] });
        },
    });

    /*
     * Sets the title of the page to "Budgets | Wallet" when the component mounts
     */
    useEffect(() => {
        document.title = "Monthly Budgets | Wallet";
    }, []);

    // Loading state
    if (isLoading) {
        return <div className='flex justify-center items-center font-primary text-center h-64'>Loading budgets...</div>;
    }

    // Error state
    if (isError) {
        return (
            <div className='w-6/12 mx-auto p-4 mt-10 bg-red-100 text-red-600 font-primary text-center rounded-md'>
                Error fetching budgets: {error.message}
            </div>
        );
    }

    return budgets.length > 0 ? (
        <BudgetDataExists
            budgets={budgets}
            createBudgetMutation={createBudgetMutation}
            updateBudgetMutation={updateBudgetMutation}
            deleteBudgetMutation={deleteBudgetMutation}
        />
    ) : (
        <NoBudget
            budgets={budgets}
            createBudgetMutation={createBudgetMutation}
        />
    );
};

export default BudgetPage;
