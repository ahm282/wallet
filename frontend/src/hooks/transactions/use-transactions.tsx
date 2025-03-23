import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/providers/ApiProvider";
import { getUserId } from "@/lib/utils";
import type { Transaction, TransactionForm } from "@/types/transactions.types";

export const useTransactions = () => {
    const api = useApi();
    const queryClient = useQueryClient();

    // Query key for transactions
    const TRANSACTIONS_QUERY_KEY = ["transactions", getUserId()];

    // Fetch transactions query
    const {
        data: transactions = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: TRANSACTIONS_QUERY_KEY,
        queryFn: async (): Promise<Transaction[]> => {
            const userId = getUserId();
            return await api.get<Transaction[]>(`/finance/transaction?id=${userId}`);
        },
    });

    // Create transaction mutation
    const createTranasactionMutation = useMutation({
        mutationFn: async (newTransaction: TransactionForm) => {
            return await api.post("/finance/transaction", {
                ...newTransaction,
                userId: getUserId(),
            });
        },
        onSuccess: () => {
            // Invalidate and refetch the transactions query
            queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
        },
    });

    // Update transaction mutation
    const updateTransactionMutation = useMutation({
        mutationFn: async (updatedTransaction: Transaction) => {
            return await api.patch(`/finance/transaction?id=${updatedTransaction.id}`, updatedTransaction);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
        },
    });

    // Delete transaction mutation
    const deleteTransactionMutation = useMutation({
        mutationFn: async (transactionId: string) => {
            return await api.delete(`/finance/transaction?id=${transactionId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
        },
    });

    return {
        transactions,
        isLoading,
        isError,
        error,
        createTranasactionMutation,
        updateTransactionMutation,
        deleteTransactionMutation,
    };
};
