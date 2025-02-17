import React from "react";
import { ArrowUpRight, ArrowDownRight, Edit2, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DeleteWarning } from "@/components/ui/delete-warning";
import { currencyNotation } from "@/lib/utils";
import type { TransactionsTableProps } from "@/types/transactions.types";

export const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions, onEdit, onDelete }) => {
    return (
        <div className='overflow-x-auto'>
            <Table className='text-center'>
                <TableHeader>
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
                            <TableCell className='px-4 md:px-2'>
                                {transaction.date?.toLocaleDateString("nl-BE")}
                            </TableCell>
                            <TableCell className='px-4 md:px-2'>{transaction.description}</TableCell>
                            <TableCell className='px-4 md:px-2'>{transaction.category}</TableCell>
                            <TableCell className='px-4 md:px-2'>
                                <span className={transaction.amount >= 0 ? "text-green-600" : "text-red-600"}>
                                    {transaction.amount >= 0 ? (
                                        <ArrowUpRight className='inline mr-1 h-4 w-4' />
                                    ) : (
                                        <ArrowDownRight className='inline mr-1 h-4 w-4' />
                                    )}
                                    {currencyNotation(transaction.amount)}
                                </span>
                            </TableCell>
                            <TableCell className='min-w-fit flex justify-center items-center'>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => onEdit(transaction)}>
                                    <Edit2 className='h-4 w-4' />
                                </Button>
                                <DeleteWarning
                                    icon={Trash2}
                                    message='Are you sure you want to delete this transaction? This action cannot be undone.'
                                    onConfirm={() => onDelete(Number(transaction.id))}>
                                    <Button
                                        variant='ghost'
                                        size='xl'
                                        className='px-2 !max-h-12 rounded-md hover:text-red-500'>
                                        <Trash2 className='h-4 w-4' />
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
