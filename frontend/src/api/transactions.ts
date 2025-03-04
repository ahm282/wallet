import { instantiateAPI } from "@/lib/api_utils";
import { getUserId } from "@/lib/utils";
import type { Transaction } from "@/types/transactions.types";

export const fetchTransactions = async (): Promise<Transaction[]> => {
    const userId = getUserId();
    const api = instantiateAPI();
    return await api.get<Transaction[]>(`/transaction?id=${userId}`);
};

export const createTransaction = async (newTransaction: Omit<Transaction, "id">) => {
    const api = instantiateAPI();
    return await api.post("/transaction", {
        ...newTransaction,
        userId: getUserId(),
    });
};

export const updateTransaction = async (updatedTransaction: Transaction) => {
    const api = instantiateAPI();
    return await api.patch(`/transaction?id=${updatedTransaction.id}`, updatedTransaction);
};

export const deleteTransaction = async (transactionId: string) => {
    const api = instantiateAPI();
    return await api.delete(`/transaction?id=${transactionId}`);
};
