import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTransactions, createTransaction, updateTransaction, deleteTransaction } from "@/api/transactions";
import { getUserId } from "@/lib/utils";
import type { Transaction } from "@/types/transactions.types";

export function useTransactions() {
    const queryClient = useQueryClient();

    const {
        data: transactions = [],
        isLoading,
        isError,
        error,
    } = useQuery<Transaction[], Error>({ queryKey: ["transactions", getUserId()], queryFn: fetchTransactions });

    // Mutation for adding a transaction
    const createTranasactionMutation = useMutation({
        mutationFn: async (newTransaction: Omit<Transaction, "id">) => {
            return createTransaction(newTransaction);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions", getUserId()] });
        },
    });

    // Mutation for updating a transaction
    const updateTransactionMutation = useMutation({
        mutationFn: async (updatedTransaction: Transaction) => {
            return updateTransaction(updatedTransaction);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions", getUserId()] });
        },
    });

    // Mutation for deleting a transaction
    const deleteTransactionMutation = useMutation({
        mutationFn: async (transactionId: string) => {
            return deleteTransaction(transactionId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions", getUserId()] });
        },
    });

    return {
        transactions,
        createTranasactionMutation,
        updateTransactionMutation,
        deleteTransactionMutation,
        isLoading,
        isError,
        error,
    };
}

export default useTransactions;
