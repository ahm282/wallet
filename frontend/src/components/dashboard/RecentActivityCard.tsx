import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currencyNotation, formatDateString } from "@/lib/utils";
import { Link } from "react-router";

export const RecentActivityCard = ({ data }: { data: any }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest financial transactions</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='space-y-4'>
                    {data.map((activity: any, index: any) => (
                        <div
                            key={index}
                            className='flex items-start justify-between p-3 rounded-lg bg-muted/50'>
                            <div className='flex items-start space-x-3'>
                                <div
                                    className={`p-2 rounded-full ${
                                        activity.amount >= 0
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                    }`}>
                                    {activity.amount >= 0 ? (
                                        <ArrowUpRight className='h-4 w-4' />
                                    ) : (
                                        <ArrowDownRight className='h-4 w-4' />
                                    )}
                                </div>
                                <div>
                                    <div className='font-medium'>{activity.description}</div>
                                    <div className='text-xs text-muted-foreground'>{activity.category}</div>
                                    <div className='text-xs mt-1'>{formatDateString(activity.date)}</div>
                                </div>
                            </div>
                            <div
                                className={`text-right font-bold ${
                                    activity.amount >= 0
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-red-600 dark:text-red-400"
                                }`}>
                                {currencyNotation(Math.abs(activity.amount))}
                            </div>
                        </div>
                    ))}
                    <Button
                        className='w-full'
                        variant='default'>
                    <Link
                        to='/transactions'
                        className='w-full'>
                        View All Transactions
                    </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default RecentActivityCard;
