import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, CreditCard, Calendar, PiggyBank, BellRing, FileCheck } from "lucide-react";
import { AddBillDialog } from "@/components/bills/AddBillDialog";
import type { NoBillsProps } from "@/types/bills.types";

export const NoBills: React.FC<NoBillsProps> = ({ createBillMutation }) => {
    return (
        <div className='md:w-10/12 lg:w-10/12 lg:max-w-4xl 2xl:max-w-5xl my-8 mx-auto flex flex-col space-y-3'>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Your Bills</CardTitle>
                    <CardDescription>Start tracking your bills to stay on top of your expenses</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                    <div className='space-y-2'>
                        <p className='text-sm text-muted-foreground'>
                            Managing your bills helps you avoid late payments and maintain a healthy financial
                            status.&nbsp;&nbsp;📝
                        </p>
                    </div>
                    <AddBillDialog createBillMutation={createBillMutation}></AddBillDialog>
                </CardContent>
            </Card>
            <div className='flex flex-col items-center justify-center lg:flex-row lg:justify-evenly lg:space-x-4 space-y-3 lg:space-y-0'>
                <Card className='w-full'>
                    <CardHeader>
                        <CardTitle>Common bills to track</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        <div className='flex items-center'>
                            <Receipt className='me-2 size-4 text-muted-foreground' />
                            <span className='text-sm'>Monthly utilities</span>
                        </div>
                        <div className='flex items-center'>
                            <CreditCard className='me-2 size-4 text-muted-foreground' />
                            <span className='text-sm'>Credit card payments</span>
                        </div>
                        <div className='flex items-center'>
                            <Calendar className='me-2 size-4 text-muted-foreground' />
                            <span className='text-sm'>Subscription services</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className='w-full'>
                    <CardHeader>
                        <CardTitle>Tips for bill management</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        <div className='flex items-center'>
                            <BellRing className='me-2 size-4 text-muted-foreground' />
                            <span className='text-sm'>Set up payment reminders</span>
                        </div>
                        <div className='flex items-center'>
                            <PiggyBank className='me-2 size-4 text-muted-foreground' />
                            <span className='text-sm'>Budget for regular expenses</span>
                        </div>
                        <div className='flex items-center'>
                            <FileCheck className='me-2 size-4 text-muted-foreground' />
                            <span className='text-sm'>Keep track of due dates</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default NoBills;
