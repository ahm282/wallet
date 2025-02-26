import React from "react";
import { ArrowUpRight, ArrowDownRight, Edit2, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DeleteWarning } from "@/components/ui/delete-warning";
import { currencyNotation } from "@/lib/utils";
import type { TransactionsTableProps } from "@/types/transactions.types";

export const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions, onEdit, onDelete }) => {
    return (
        <div
            className={`overflow-auto max-h-[500px] lg:px-4 ${
                transactions.length >= 10
                    ? "overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
                    : ""
            }`}>
            <Table className='text-center whitespace-nowrap'>
                <TableHeader className='sticky top-0 z-10 bg-white dark:bg-darkElement'>
                    <TableRow>
                        <TableHead className='text-center'>Date</TableHead>
                        <TableHead className='text-center'>Description</TableHead>
                        <TableHead className='text-center'>Category</TableHead>
                        <TableHead className='text-center'>Amount</TableHead>
                        <TableHead className='text-center'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell className='px-2'>{transaction.date?.toLocaleDateString("nl-BE")}</TableCell>
                            <TableCell className='px-2'>{transaction.description}</TableCell>
                            <TableCell className='px-2'>{transaction.category}</TableCell>
                            <TableCell className='px-2'>
                                <span className={transaction.amount >= 0 ? "text-green-600" : "text-red-600"}>
                                    {currencyNotation(transaction.amount)}&nbsp;
                                    {transaction.amount >= 0 ? (
                                        <ArrowUpRight className='ms-1 size-4 hidden md:inline' />
                                    ) : (
                                        <ArrowDownRight className='ms-1 size-4 hidden md:inline' />
                                    )}
                                </span>
                            </TableCell>
                            <TableCell className='min-w-fit flex justify-center items-center'>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => onEdit(transaction)}>
                                    <Edit2 className='size-4' />
                                </Button>
                                <DeleteWarning
                                    icon={Trash2}
                                    message='Are you sure you want to delete this transaction? This action cannot be undone.'
                                    onConfirm={() => onDelete(Number(transaction.id))}>
                                    <Button
                                        variant='ghost'
                                        size='xl'
                                        className='px-2 !max-h-12 rounded-md hover:text-red-500'>
                                        <Trash2 className='size-4' />
                                    </Button>
                                </DeleteWarning>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default TransactionsTable;
