import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit2, Trash2, LucideCalendar } from "lucide-react";
import { AddBillDialog } from "@/components/bills/AddBillDialog";
import { EditBillDialog } from "@/components/bills/EditBillDialog";
import { DeleteWarning } from "@/components/ui/delete-warning";
import { currencyNotation } from "@/lib/utils";
import { format } from "date-fns";
import type { Bill, BillsDataExistsProps } from "@/types/bills.types";
import BillsDashboard from "./BillsDashboard";

export const BillsDataExists: React.FC<BillsDataExistsProps> = ({ bills, setBills }) => {
    const [editingBill, setEditingBill] = useState<Bill | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleEdit = (bill: Bill) => {
        setEditingBill(bill);
        setIsEditDialogOpen(true);
    };

    const handleSaveEdit = (updatedBill: Bill) => {
        setBills(bills.map((b) => (b.id === updatedBill.id ? updatedBill : b)));
        setEditingBill(null);
    };

    const handleDelete = (id: number) => {
        setBills(bills.filter((b) => b.id !== id));
    };

    const payBill = (id: number) => {
        setBills(
            bills.map((b) =>
                b.id === id
                    ? {
                          ...b,
                          paid: true,
                          paidOn: format(new Date(), "yyyy-MM-dd"),
                      }
                    : b
            )
        );
    };

    return (
        <div className='w-11/12 md:w-10/12 lg:max-w-4xl 2xl:max-w-5xl my-8 mx-auto flex flex-col space-y-5'>
            <Card>
                <CardHeader className='space-y-0 pb-8'>
                    <CardTitle className='text-2xl font-bold flex flex-row items-center justify-between'>
                        <div className='flex items-center font-primary text-2xl'>
                            <LucideCalendar className='size-7 me-3' />
                            <CardTitle className='text-2xl font-bold'>Bills</CardTitle>
                        </div>
                        <AddBillDialog
                            bills={bills}
                            setBills={setBills}
                        />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='overflow-auto'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Beneficiary</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Paid On</TableHead>
                                    <TableHead className='text-center'>Paid</TableHead>
                                    <TableHead className='text-center'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bills.map((bill) => (
                                    <TableRow key={bill.id}>
                                        <TableCell>{bill.payee}</TableCell>
                                        <TableCell>{currencyNotation(bill.amount)}</TableCell>
                                        <TableCell>{bill.dueDate}</TableCell>
                                        <TableCell>{bill.paidOn ? bill.paidOn : ""}</TableCell>
                                        <TableCell className='text-center'>
                                            {bill.paid ? (
                                                <div>
                                                    <span className='text-green-500'>Yes</span>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant='default'
                                                    size='sm'
                                                    onClick={() => payBill(bill.id)}>
                                                    Pay bill
                                                </Button>
                                            )}
                                        </TableCell>
                                        <TableCell className='text-center flex items-center justify-center'>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                onClick={() => handleEdit(bill)}>
                                                <Edit2 className='h-4 w-4' />
                                            </Button>
                                            <DeleteWarning
                                                icon={Trash2}
                                                message='Are you sure you want to delete this bill? This action cannot be undone.'
                                                onConfirm={() => handleDelete(bill.id)}>
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
                </CardContent>
            </Card>
            <BillsDashboard bills={bills} />
            <EditBillDialog
                bill={editingBill}
                isOpen={isEditDialogOpen}
                setIsOpen={setIsEditDialogOpen}
                onSave={handleSaveEdit}
            />
        </div>
    );
};

export default BillsDataExists;
