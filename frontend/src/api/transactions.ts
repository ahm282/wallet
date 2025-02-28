import { instantiateAPI } from "@/lib/api_utils";
import { getUserId } from "@/lib/utils";
import type { Transaction } from "@/types/transactions.types";

export const fetchTransactions = async (): Promise<Transaction[]> => {
    const userId = getUserId();
    const api = instantiateAPI("http://localhost:3000/api");
    return await api.get<Transaction[]>(`/finance/transaction?id=${userId}`);
};

export const createTransaction = async (newTransaction: Omit<Transaction, "id">) => {
    const api = instantiateAPI("http://localhost:3000/api");
    return await api.post("/finance/transaction", {
        ...newTransaction,
        userId: getUserId(),
    });
};

export const updateTransaction = async (updatedTransaction: Transaction) => {
    const api = instantiateAPI("http://localhost:3000/api");
    return await api.patch(`/finance/transaction?id=${updatedTransaction.id}`, updatedTransaction);
};

export const deleteTransaction = async (transactionId: string) => {
    const api = instantiateAPI("http://localhost:3000/api");
    return await api.delete(`/finance/transaction?id=${transactionId}`);
};
