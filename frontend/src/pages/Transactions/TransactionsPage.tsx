import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Category, type Transaction } from "@/types/transactions.types";
// import { addDays } from "date-fns";
import { AlertCircle, PlusCircle } from "lucide-react";
import { TransactionFilters } from "@/components/transactions/TransactionsFilters";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog";
import { EditTransactionDialog } from "@/components/transactions/EditTransactionDialog";
import { DateRange } from "react-day-picker";
import { Label } from "@/components/ui/label";

export const TransactionsPage = () => {
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
    const [newTransaction, setNewTransaction] = useState<Omit<Transaction, "id">>({
        date: undefined,
        description: "",
        amount: 0,
        category: Category.Other,
    });
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<Category | string>("all");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);

    // Filter transactions if filters change value
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

    // Callback for adding a new transaction.
    const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
        setTransactions([
            ...transactions,
            {
                id: transactions.length + 1,
                ...transaction,
            },
        ]);
    };

    // Callback for editing an existing transaction.
    const handleEditTransaction = (updated: Transaction) => {
        setTransactions(transactions.map((t) => (t.id === updated.id ? updated : t)));
    };

    // Callback for deleting a transaction.
    const handleDeleteTransaction = (id: number) => {
        setTransactions(transactions.filter((t) => t.id !== id));
    };

    return (
        <div className='w-11/12 md:w-10/12 lg:max-w-6xl 2xl:max-w-7xl my-8 mx-auto flex flex-col space-y-5'>
            <Card className='lg:min-h-[400px]'>
                <CardHeader>
                    <CardTitle className='text-2xl font-bold'>Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='lg:flex lg:justify-between lg:items-center lg:px-1'>
                        <TransactionFilters
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            categoryFilter={categoryFilter}
                            setCategoryFilter={setCategoryFilter}
                            dateRange={dateRange}
                            setDateRange={setDateRange}
                        />
                        <div className='flex flex-col'>
                            <Label
                                htmlFor='add-transaction'
                                className='invisible'>
                                Add Transaction
                            </Label>
                            <Button
                                id='add-transaction'
                                className='w-full lg:max-w-40'
                                onClick={() => setIsAddDialogOpen(true)}>
                                <PlusCircle className='mr-2 size-4' />
                                Add Transaction
                            </Button>
                        </div>
                    </div>
                    {transactions.length === 0 ? (
                        <div className='flex flex-col justify-center items-center my-20 lg:my-28'>
                            <AlertCircle className='mx-auto h-10 w-10 text-foreground' />
                            <h3 className='mt-2 text-sm font-medium text-muted-foreground'>No transactions found.</h3>
                            <p className='mt-1 text-sm text-muted-foreground'>
                                Get started by adding a new transaction.
                            </p>
                        </div>
                    ) : (
                        <div className='py-14'>
                            <TransactionsTable
                                transactions={filteredTransactions}
                                onEdit={(transaction) => {
                                    setEditingTransaction(transaction);
                                    setIsEditDialogOpen(true);
                                }}
                                onDelete={handleDeleteTransaction}
                            />
                            {filteredTransactions.length === 0 && (
                                <div className='text-center py-4 text-muted-foreground'>
                                    No transactions found matching your criteria.
                                </div>
                            )}
                            <div className='mt-4 flex justify-between items-center'>
                                <div className='text-sm text-muted-foreground'>
                                    Showing {filteredTransactions.length} of {transactions.length} transactions
                                </div>
                                {/* <Button variant='outline'>Load More</Button> */}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <AddTransactionDialog
                isOpen={isAddDialogOpen}
                setIsOpen={setIsAddDialogOpen}
                onAdd={handleAddTransaction}
                newTransaction={newTransaction}
                setNewTransaction={setNewTransaction}
                categories={Object.values(Category)}
            />

            <EditTransactionDialog
                isOpen={isEditDialogOpen}
                setIsOpen={setIsEditDialogOpen}
                transaction={editingTransaction}
                onSave={handleEditTransaction}
                categories={Object.values(Category)}
            />
        </div>
    );
};

export default TransactionsPage;
