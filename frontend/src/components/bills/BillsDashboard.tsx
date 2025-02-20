import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { LucideCalendarDays, CheckCircle, XCircle, AlertCircle, Clock, FileText, CreditCard } from "lucide-react";
import { currencyNotation } from "@/lib/utils";
import type { BillsDashboardProps } from "@/types/bills.types";

export const BillsDashboard: React.FC<BillsDashboardProps> = ({ bills }) => {
    const now = new Date();
    const totalBills = bills.length;
    const totalAmount = bills.reduce((acc, bill) => acc + bill.amount, 0);
    const totalPaid = bills.filter((bill) => bill.paid).reduce((acc, bill) => acc + bill.amount, 0);
    const totalUnpaid = bills.filter((bill) => !bill.paid).reduce((acc, bill) => acc + bill.amount, 0);
    const totalOverdue = bills
        .filter((bill) => !bill.paid && new Date(bill.dueDate) < now)
        .reduce((acc, bill) => acc + bill.amount, 0);

    const totalUpcoming = bills
        .filter((bill) => !bill.paid && new Date(bill.dueDate) >= now)
        .reduce((acc, bill) => acc + bill.amount, 0);

    const upcomingBills = bills.filter((bill) => new Date(bill.dueDate) >= now && !bill.paid);
    const overdueBills = bills.filter((bill) => new Date(bill.dueDate) < now && !bill.paid);

    return (
        <div className='space-y-6'>
            {/* Overview Card */}
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center text-2xl font-primary'>
                        <FileText className='size-7 me-3' />
                        Overview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {/* Total Bills */}
                        <div className='flex flex-col items-center p-4 bg-background rounded-lg shadow'>
                            <FileText className='h-8 w-8 text-amber-500 mb-2' />
                            <span className='text-sm text-muted-foreground mb-1'>Total Bills</span>
                            <p className='text-2xl font-semibold'>{totalBills}</p>
                        </div>

                        {/* Total Amount */}
                        <div className='flex flex-col items-center p-4 bg-background rounded-lg shadow'>
                            <CreditCard className='h-8 w-8 text-blue-600 mb-2' />
                            <span className='text-sm text-muted-foreground mb-1'>Total Amount</span>
                            <p className='text-2xl font-semibold'>{currencyNotation(totalAmount)}</p>
                        </div>

                        {/* Paid Amount */}
                        <div className='flex flex-col items-center p-4 bg-background rounded-lg shadow'>
                            <CheckCircle className='h-8 w-8 text-green-500 mb-2' />
                            <span className='text-sm text-muted-foreground mb-1'>Paid</span>
                            <p className='text-2xl font-semibold'>{currencyNotation(totalPaid)}</p>
                        </div>

                        {/* Unpaid Amount */}
                        <div className='flex flex-col items-center p-4 bg-background rounded-lg shadow'>
                            <XCircle className='h-8 w-8 text-red-500 mb-2' />
                            <span className='text-sm text-muted-foreground mb-1'>Unpaid</span>
                            <p className='text-2xl font-semibold'>{currencyNotation(totalUnpaid)}</p>
                            <div className='mt-2 text-sm space-y-1'>
                                <div className='flex items-center justify-between w-full'>
                                    <span className='flex items-center'>
                                        <AlertCircle className='h-4 w-4 text-orange-500 mr-1' />
                                        Overdue:
                                    </span>
                                    <span>{currencyNotation(totalOverdue)}</span>
                                </div>
                                <div className='flex items-center justify-between w-full'>
                                    <span className='flex items-center'>
                                        <Clock className='h-4 w-4 text-purple-500 mr-1' />
                                        Upcoming:
                                    </span>
                                    <span>{currencyNotation(totalUpcoming)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Upcoming Bills Card */}
            {upcomingBills.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center text-2xl font-primary'>
                            <LucideCalendarDays className='size-7 me-3' />
                            Upcoming Bills
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Payee</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Due Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {upcomingBills.map((bill) => (
                                    <TableRow key={bill.id}>
                                        <TableCell>{bill.payee}</TableCell>
                                        <TableCell>{currencyNotation(bill.amount)}</TableCell>
                                        <TableCell>{bill.dueDate}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* Overdue Bills Card */}
            {overdueBills.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center text-2xl font-primary'>
                            <AlertCircle className='size-7 me-3 text-red-500' />
                            Overdue Bills
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Payee</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Due Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {overdueBills.map((bill) => (
                                    <TableRow key={bill.id}>
                                        <TableCell>{bill.payee}</TableCell>
                                        <TableCell>{currencyNotation(bill.amount)}</TableCell>
                                        <TableCell>{bill.dueDate}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default BillsDashboard;
