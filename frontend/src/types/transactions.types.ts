import { DateRange } from "react-day-picker";
import { Dispatch, SetStateAction } from "react";

// Transactions definitions
export type Transaction = {
    id: number;
    date?: Date | undefined;
    description: string;
    amount: number;
    category: Category;
};

export interface TransactionsTableProps {
    transactions: Transaction[];
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
    onAdd: (transaction: Omit<Transaction, "id">) => void;
    newTransaction: Omit<Transaction, "id">;
    setNewTransaction: React.Dispatch<React.SetStateAction<Omit<Transaction, "id">>>;
    categories: Category[];
}

export interface EditTransactionDialogProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    transaction: Transaction | null;
    onSave: (transaction: Transaction) => void;
    categories: Category[];
}

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

export interface CategorySelectProps {
    value: Category;
    onValueChange: (value: Category) => void;
    isFormSelect?: boolean;
    className?: string;
}
