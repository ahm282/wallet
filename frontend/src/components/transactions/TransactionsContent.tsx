import React from "react";
import { AlertCircle } from "lucide-react";
import { TransactionsTable } from "./TransactionsTable";
import type { TransactionsContentProps } from "@/types/transactions.types";

export const TransactionsContent: React.FC<TransactionsContentProps> = ({
    transactions,
    filteredTransactions,
    onEdit,
    onDelete,
}) => {
    if (transactions.length === 0) {
        return (
            <div className='flex flex-col justify-center items-center my-20 lg:my-28'>
                <AlertCircle className='mx-auto h-10 w-10 text-foreground' />
                <h3 className='mt-2 text-sm font-medium text-muted-foreground'>No transactions found.</h3>
                <p className='mt-1 text-sm text-muted-foreground'>Get started by adding a new transaction.</p>
            </div>
        );
    }

    return (
        <div className='py-14'>
            <TransactionsTable
                transactions={filteredTransactions}
                onEdit={onEdit}
                onDelete={onDelete}
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
            </div>
        </div>
    );
};

export default TransactionsContent;
