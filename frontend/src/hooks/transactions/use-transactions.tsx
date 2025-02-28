import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTransactions, createTransaction, updateTransaction, deleteTransaction } from "@/api/transactions";
import type { Transaction } from "@/types/transactions.types";

export function useTransactions() {
    const queryClient = useQueryClient();

    const {
        data: transactions = [],
        isLoading,
        isError,
        error,
    } = useQuery<Transaction[], Error>({ queryKey: ["transactions"], queryFn: fetchTransactions });

    // Mutation for adding a transaction
    const createTranasactionMutation = useMutation({
        mutationFn: async (newTransaction: Omit<Transaction, "id">) => {
            createTransaction(newTransaction);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
        },
    });

    // Mutation for updating a transaction
    const updateTransactionMutation = useMutation({
        mutationFn: async (updatedTransaction: Transaction) => {
            updateTransaction(updatedTransaction);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
        },
    });

    // Mutation for deleting a transaction
    const deleteTransactionMutation = useMutation({
        mutationFn: async (transactionId: string) => {
            deleteTransaction(transactionId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
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
