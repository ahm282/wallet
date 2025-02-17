import { useState } from "react";
import { type Transaction, Category } from "@/types/transactions.types";

export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([
        {
            id: 1,
            date: new Date(),
            description: "Groceries",
            amount: -50,
            category: Category.Food,
        },
        {
            id: 2,
            date: new Date(),
            description: "Gas",
            amount: -30,
            category: Category.Transportation,
        },
        {
            id: 3,
            date: new Date(),
            description: "Movie",
            amount: -15,
            category: Category.Entertainment,
        },
        {
            id: 4,
            date: new Date(),
            description: "Salary",
            amount: 2000,
            category: Category.Income,
        },
        {
            id: 5,
            date: new Date(),
            description: "Rent",
            amount: -1000,
            category: Category.Housing,
        },
    ]);

    const addTransaction = (transaction: Omit<Transaction, "id">) => {
        setTransactions((prev) => [...prev, { ...transaction, id: Date.now() }]);
    };

    const editTransaction = (updated: Transaction) => {
        setTransactions((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    };

    const deleteTransaction = (id: number) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    };

    return { transactions, addTransaction, editTransaction, deleteTransaction };
}
