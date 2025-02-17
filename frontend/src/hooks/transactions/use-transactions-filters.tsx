import { useEffect, useState } from "react";
import type { Transaction, Category } from "@/types/transactions.types";
import { DateRange } from "react-day-picker";

export function useTransactionFilters(transactions: Transaction[]) {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<Category | string>("all");
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);

    useEffect(() => {
        const filtered = transactions.filter((transaction) => {
            const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter;
            const transactionDate = transaction.date || new Date();
            const isInDateRange = dateRange
                ? (!dateRange.from || transactionDate >= dateRange.from) &&
                  (!dateRange.to || transactionDate <= dateRange.to)
                : true;
            return matchesSearch && matchesCategory && isInDateRange;
        });
        setFilteredTransactions(filtered);
    }, [transactions, searchTerm, categoryFilter, dateRange]);

    return {
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        dateRange,
        setDateRange,
        filteredTransactions,
    };
}
