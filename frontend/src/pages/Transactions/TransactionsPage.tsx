import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, List } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useTransactions } from "@/hooks/transactions/use-transactions";
import { useTransactionFilters } from "@/hooks/transactions/use-transactions-filters";
import { TransactionsFilters } from "@/components/transactions/TransactionsFilters";
import { TransactionsContent } from "@/components/transactions/TransactionsContent";
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog";
import { EditTransactionDialog } from "@/components/transactions/EditTransactionDialog";
import { Category } from "@/types/transactions.types";
import type { Transaction, TransactionForm } from "@/types/transactions.types";

export const TransactionsPage = () => {
    const { transactions, createTranasactionMutation, updateTransactionMutation, deleteTransactionMutation } =
        useTransactions();
    const {
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        dateRange,
        setDateRange,
        filteredTransactions,
    } = useTransactionFilters(transactions);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [newTransaction, setNewTransaction] = useState<TransactionForm>({
        date: undefined,
        description: "",
        amount: 0,
        category: null,
    });

    /*
     * Sets the title of the page to "Transactions | Wallet" when the component mounts
     */
    useEffect(() => {
        document.title = "Transactions | Wallet";
    }, []);

    const handleEditClick = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsEditDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        deleteTransactionMutation.mutate(id);
    };

    const handleSaveEdit = (updatedTransaction: Transaction) => {
        updateTransactionMutation.mutate(updatedTransaction);
        setEditingTransaction(null);
    };

    const handleSaveAdd = (newTransaction: TransactionForm) => {
        createTranasactionMutation.mutate(newTransaction);
        setNewTransaction({
            date: undefined,
            description: "",
            amount: 0,
            category: null,
        });
    };

    return (
        <div className='w-11/12 md:w-10/12 lg:max-w-6xl 2xl:max-w-7xl my-8 mx-auto flex flex-col space-y-5'>
            <Card className='lg:min-h-[400px]'>
                <CardHeader>
                    <CardTitle className='flex items-center font-primary text-2xl font-bold'>
                        <List className='h-6 w-6 me-3' />
                        Transactions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='lg:flex lg:justify-between lg:items-center lg:px-1'>
                        <TransactionsFilters
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
                                <PlusCircle className='mr-2 h-4 w-4' />
                                Add Transaction
                            </Button>
                        </div>
                    </div>
                    <TransactionsContent
                        transactions={transactions}
                        filteredTransactions={filteredTransactions}
                        onEdit={handleEditClick}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>

            <AddTransactionDialog
                isOpen={isAddDialogOpen}
                setIsOpen={setIsAddDialogOpen}
                onAdd={handleSaveAdd}
                newTransaction={newTransaction}
                setNewTransaction={setNewTransaction}
                categories={Object.values(Category)}
            />

            <EditTransactionDialog
                isOpen={isEditDialogOpen}
                setIsOpen={setIsEditDialogOpen}
                transaction={editingTransaction}
                onSave={handleSaveEdit}
                categories={Object.values(Category)}
            />
        </div>
    );
};

export default TransactionsPage;
