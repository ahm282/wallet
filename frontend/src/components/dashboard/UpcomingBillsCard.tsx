import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currencyNotation } from "@/lib/utils";
import { payBill } from "@/api/bills";

const UpcomingBillsCard = ({ data }: { data: any }) => {
    const { total_bills, total_due_amount, upcoming_bills } = data;

    // Sort bills by days until due
    const sortedBills = [...upcoming_bills].sort((a, b) => a.days_until_due - b.days_until_due);

    // Function to be called when a bill is paid
    const queryClient = useQueryClient();

    const handleBillPaid = () => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
    };

    // Mutation for invalidating and refetching the dashboard data
    const { mutate: payBillHandler } = useMutation({
        mutationFn: (billId: string) => payBill(billId),
        onSettled: handleBillPaid,
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                    <span>Upcoming Bills</span>
                    <span className='text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full'>
                        {currencyNotation(total_due_amount)}
                    </span>
                </CardTitle>
                <CardDescription>You have {total_bills} bills due soon</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='space-y-4'>
                    {sortedBills.length > 0 ? (
                        sortedBills.map((bill) => (
                            <div
                                key={bill.id}
                                className='flex items-start justify-between p-3 rounded-lg bg-muted/50'>
                                <div className='flex items-start space-x-3'>
                                    <div
                                        className={`p-2 rounded-full ${
                                            bill.days_until_due === 0
                                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                : bill.days_until_due <= 3
                                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                        }`}>
                                        <CalendarDays className='h-5 w-5' />
                                    </div>
                                    <div>
                                        <div className='font-medium'>{bill.payee}</div>
                                        <div className='text-xs text-muted-foreground'>{bill.description}</div>
                                        <div className='text-sm mt-1'>
                                            {bill.days_until_due === 0 ? (
                                                <span className='text-red-600 dark:text-red-400 font-medium'>
                                                    Due today
                                                </span>
                                            ) : bill.days_until_due === 1 ? (
                                                <span className='text-amber-600 dark:text-amber-400 font-medium'>
                                                    Due tomorrow
                                                </span>
                                            ) : (
                                                <span>Due in {bill.days_until_due} days</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='text-right'>
                                    <div className='text-sm font-bold'>{currencyNotation(bill.amount)}</div>
                                    <Button
                                        size='sm'
                                        className='mt-2'
                                        onClick={() => payBillHandler(bill.id)}>
                                        Pay Now
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='flex flex-col items-center justify-center py-6 text-center'>
                            <AlertCircle className='h-10 w-10 text-muted-foreground mb-2' />
                            <h3 className='font-medium'>No upcoming bills</h3>
                            <p className='text-sm text-muted-foreground mt-1'>All your bills are paid. Great job!</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default UpcomingBillsCard;
