import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet, CreditCard, Landmark, Edit2, Trash2, LucideWallet } from "lucide-react";
import { currencyNotation } from "@/lib/utils";
import { AddAccountDialog } from "@/components/accounts/AddAccountDialog";
import { EditAccountDialog } from "@/components/accounts/EditAccountDialog";
import { DeleteWarning } from "@/components/ui/delete-warning";
import { Account, AccountsDataExistsProps } from "@/types/accounts.types";

export const AccountsDataExists: React.FC<AccountsDataExistsProps> = ({ accounts, setAccounts }) => {
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleEdit = (account: Account) => {
        setEditingAccount(account);
        setIsEditDialogOpen(true);
    };

    const handleSaveEdit = (updatedAccount: Account) => {
        setAccounts(accounts.map((a) => (a.id === updatedAccount.id ? updatedAccount : a)));
        setEditingAccount(null);
    };

    const handleDelete = (id: number) => {
        setAccounts(accounts.filter((a) => a.id !== id));
    };

    const totalDebt = Math.abs(
        accounts.filter((a) => a.balance < 0).reduce((sum, account) => sum + account.balance, 0)
    );
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    const netWorth = totalBalance - totalDebt;

    return (
        <div className='w-11/12 md:w-10/12 lg:max-w-4xl 2xl:max-w-5xl my-8 mx-auto flex flex-col space-y-5'>
            <Card>
                <CardHeader className='space-y-0 pb-8'>
                    <CardTitle className='text-2xl font-bold flex flex-row items-center justify-between'>
                        <div className='flex items-center font-primary text-2xl font-bold'>
                            <LucideWallet className='size-7 me-3' />
                            <CardTitle className='text-2xl font-bold'>Accounts</CardTitle>
                        </div>
                        <AddAccountDialog
                            accounts={accounts}
                            setAccounts={setAccounts}
                        />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Institution</TableHead>
                                <TableHead>Balance</TableHead>
                                <TableHead className='text-center'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {accounts.map((account) => (
                                <TableRow key={account.id}>
                                    <TableCell>
                                        <span>{account.name.charAt(0).toUpperCase() + account.name.slice(1)}</span>
                                    </TableCell>
                                    <TableCell>{account.institution}</TableCell>
                                    <TableCell>
                                        <span className={account.balance >= 0 ? "text-green-600" : "text-red-600"}>
                                            {currencyNotation(account.balance)}
                                        </span>
                                    </TableCell>
                                    <TableCell className='text-center'>
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => handleEdit(account)}>
                                            <Edit2 className='h-4 w-4' />
                                        </Button>
                                        <DeleteWarning
                                            icon={Trash2}
                                            message='Are you sure you want to delete this goal? This action cannot be undone.'
                                            onConfirm={() => handleDelete(account.id)}>
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
                </CardContent>
            </Card>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Balance</CardTitle>
                        <Wallet className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{currencyNotation(totalBalance)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Debt</CardTitle>
                        <CreditCard className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{currencyNotation(totalDebt)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Net Worth</CardTitle>
                        <Landmark className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{currencyNotation(netWorth)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Accounts</CardTitle>
                        <Wallet className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{accounts.length}</div>
                    </CardContent>
                </Card>
            </div>
            <EditAccountDialog
                account={editingAccount}
                isOpen={isEditDialogOpen}
                setIsOpen={setIsEditDialogOpen}
                onSave={handleSaveEdit}
            />
        </div>
    );
};

export default AccountsDataExists;
