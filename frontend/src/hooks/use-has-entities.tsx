import { useQuery } from "@tanstack/react-query";
import { fetchAccounts } from "@/api/accounts";
import { fetchBudgets } from "@/api/budgets";
import { fetchGoals } from "@/api/goals";
import { fetchTransactions } from "@/api/transactions";
import { getUserId } from "@/lib/utils";

export const useHasEntities = () => {
    const { data: accounts } = useQuery({
        queryKey: ["accounts", getUserId()],
        queryFn: fetchAccounts,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const { data: budgets } = useQuery({
        queryKey: ["budgets", getUserId()],
        queryFn: fetchBudgets,
        staleTime: 5 * 60 * 1000,
    });

    const { data: goals } = useQuery({
        queryKey: ["goals", getUserId()],
        queryFn: fetchGoals,
        staleTime: 5 * 60 * 1000,
    });

    const { data: transactions } = useQuery({
        queryKey: ["transactions", getUserId()],
        queryFn: fetchTransactions,
        staleTime: 5 * 60 * 1000,
    });

    return {
        hasAccounts: (accounts?.length || 0) > 0,
        hasBudgets: (budgets?.length || 0) > 0,
        hasGoals: (goals?.length || 0) > 0,
        hasTransactions: (transactions?.length || 0) > 0,
    };
};

export default useHasEntities;
