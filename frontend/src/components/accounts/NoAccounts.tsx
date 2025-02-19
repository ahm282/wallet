import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Wallet, PiggyBank, DollarSign, BarChart, Target } from "lucide-react";
import { AddAccountDialog } from "@/components/accounts/AddAccountDialog";
import type { NoAccountsProps } from "@/types/accounts.types";

export const NoAccounts: React.FC<NoAccountsProps> = ({ accounts, setAccounts }) => {
    return (
        <div className='w-11/12 md:w-10/12 lg:w-7/12 2xl:w-6/12 my-8 mx-auto flex flex-col space-y-3'>
            <Card>
                <CardHeader>
                    <CardTitle>Add Your Financial Accounts</CardTitle>
                    <CardDescription>Start managing your finances by adding your accounts</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                    <div className='space-y-2'>
                        <p className='text-sm text-muted-foreground'>
                            Track your finances by adding your bank accounts, credit cards, and investment
                            accounts.&nbsp;&nbsp;💳
                        </p>
                    </div>
                    <AddAccountDialog
                        accounts={accounts}
                        setAccounts={setAccounts}></AddAccountDialog>
                </CardContent>
            </Card>
            <div className='flex flex-col items-center justify-center lg:flex-row lg:justify-evenly lg:space-x-4 space-y-3 lg:space-y-0'>
                <Card className='w-full'>
                    <CardHeader>
                        <CardTitle>Account types</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        <div className='flex items-center'>
                            <CreditCard className='me-2 size-4 text-muted-foreground' />
                            <span className='text-sm'>Credit cards</span>
                        </div>
                        <div className='flex items-center'>
                            <Wallet className='me-2 size-4 text-muted-foreground' />
                            <span className='text-sm'>Checking accounts</span>
                        </div>
                        <div className='flex items-center'>
                            <PiggyBank className='me-2 size-4 text-muted-foreground' />
                            <span className='text-sm'>Savings accounts</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className='w-full'>
                    <CardHeader>
                        <CardTitle>Benefits of account tracking</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        <div className='flex items-center'>
                            <DollarSign className='me-2 size-4 text-muted-foreground' />
                            <span className='text-sm'>Monitor your spending habits</span>
                        </div>
                        <div className='flex items-center'>
                            <BarChart className='me-2 size-4 text-muted-foreground' />
                            <span className='text-sm'>Track your account balances</span>
                        </div>
                        <div className='flex items-center'>
                            <Target className='me-2 size-4 text-muted-foreground' />
                            <span className='text-sm'>Stay on top of your finances</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default NoAccounts;
