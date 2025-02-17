import { ArrowUpRight, ArrowDownRight, Edit2, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DeleteWarning } from "@/components/ui/delete-warning";
import type { TransactionsTableProps } from "@/types/transactions.types";

export const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions, onEdit, onDelete }) => {
    return (
        <div className='overflow-x-auto'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className='text-right'>Amount</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell>{transaction.date?.toLocaleDateString()}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>{transaction.category}</TableCell>
                            <TableCell className='text-right'>
                                <span className={transaction.amount >= 0 ? "text-green-600" : "text-red-600"}>
                                    {transaction.amount >= 0 ? (
                                        <ArrowUpRight className='inline me-1 size-4' />
                                    ) : (
                                        <ArrowDownRight className='inline me-1 size-4' />
                                    )}
                                    ${Math.abs(transaction.amount).toFixed(2)}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => onEdit(transaction)}>
                                    <Edit2 className='size-4' />
                                </Button>
                                {/* <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => onDelete(transaction.id)}>
                                    <Trash2 className='size-4' />
                                </Button> */}
                                <DeleteWarning
                                    icon={Trash2}
                                    message='Are you sure you want to delete this transaction? This action cannot be undone.'
                                    onConfirm={() => onDelete(transaction.id)}>
                                    <Button
                                        variant='ghost'
                                        size='xl'
                                        className='px-2 !max-h-12 rounded-md hover:text-red-500'>
                                        <Trash2 className='!size-4' />
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
