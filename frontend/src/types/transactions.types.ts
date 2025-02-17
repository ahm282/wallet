// src/types/transactions.types.ts
import { DateRange } from "react-day-picker";
import { Dispatch, SetStateAction } from "react";

export enum Category {
    Food = "Food",
    Groceries = "Groceries",
    Utilities = "Utilities",
    Entertainment = "Entertainment",
    Travel = "Travel",
    Health = "Health",
    Education = "Education",
    Shopping = "Shopping",
    Transportation = "Transportation",
    Rent = "Rent",
    Mortgage = "Mortgage",
    Insurance = "Insurance",
    Bills = "Bills",
    Savings = "Savings",
    PersonalCare = "Personal Care",
    Income = "Income",
    Housing = "Housing",
    DiningOut = "Dining Out",
    Subscriptions = "Subscriptions",
    Gifts = "Gifts",
    Other = "Other",
}

export type Transaction = {
    id?: number | string;
    date: Date | undefined;
    description: string;
    amount: number;
    category: Category | null;
};

export type TransactionForm = Omit<Transaction, "id">;

export interface TransactionFormErrors {
    date?: string;
    description?: string;
    amount?: string;
    category?: string;
}

export interface TransactionsTableProps {
    transactions: Transaction[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: number) => void;
}

export interface TransactionsContentProps {
    transactions: Transaction[];
    filteredTransactions: Transaction[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: number) => void;
}

export interface TransactionFiltersProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    categoryFilter: Category | string;
    setCategoryFilter: (value: Category | string) => void;
    dateRange: DateRange | undefined;
    setDateRange: Dispatch<SetStateAction<DateRange | undefined>>;
}

export interface AddTransactionDialogProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onAdd: (transaction: TransactionForm) => void;
    newTransaction: TransactionForm;
    setNewTransaction: React.Dispatch<React.SetStateAction<TransactionForm>>;
    categories: Category[];
}

export interface EditTransactionDialogProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    transaction: Transaction | null;
    onSave: (transaction: Transaction) => void;
    categories: Category[];
}

export interface CategorySelectProps {
    value: Category | string | null;
    onValueChange: (value: string) => void;
    isFormSelect?: boolean;
    className?: string;
}
