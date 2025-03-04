import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    TrendingUp,
    TrendingDown,
    CalendarDays,
    BarChart3,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { currencyNotation, getDaysInMonth } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";

export const FinancialSummaryCard = ({ data }: { data: any }) => {
    const { total_income, total_spending, net_flow, current_month, status } = data;

    return (
        <Card>
            <CardHeader className='bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20'>
                <CardTitle className='flex items-center justify-between font-primary'>
                    <span className='font-primary'>Money Snapshot</span>
                    <span
                        className={`text-sm px-2 py-1 rounded-full ${
                            status === "positive"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                        {status === "positive" ? "In the Green" : "In the Red"}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className='pt-6'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <Card>
                        <CardTitle className='flex items-center justify-between p-4 font-secondary'>
                            <span className='text-sm text-muted-foreground flex items-center'>
                                <DollarSign className='h-3.5 w-3.5 mr-1' />
                                Total Earnings
                            </span>
                            <span className='text-xs font-medium flex justify-center items-center'>
                                <span className='mr-1'>
                                    {current_month.income_change >= 0 ? (
                                        <ArrowUpRight className='inline h-3.5 w-3.5 text-green-600 dark:text-green-400' />
                                    ) : (
                                        <ArrowDownRight className='inline h-3.5 w-3.5 text-red-600 dark:text-red-500' />
                                    )}
                                </span>
                                <span className='font-primary'>{current_month.income_change.toFixed(1)}%</span>
                            </span>
                        </CardTitle>
                        <CardContent className='ps-4'>
                            <span className='text-xl font-bold font-primary'>{currencyNotation(total_income)}</span>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardTitle className='flex items-center justify-between p-4 font-secondary'>
                            <span className='text-sm text-muted-foreground flex items-center'>
                                <DollarSign className='h-3.5 w-3.5 mr-1' />
                                Total Expenses
                            </span>
                            <span className='text-sm font-medium'>
                                <span className='mr-1'>
                                    {current_month.spending_change >= 0 ? (
                                        <ArrowUpRight className='inline h-3.5 w-3.5 text-green-600 dark:text-green-400' />
                                    ) : (
                                        <ArrowDownRight className='inline h-3.5 w-3.5 text-red-600 dark:text-red-500' />
                                    )}
                                </span>
                                <span className='font-primary'>{current_month.spending_change.toFixed(1)}%</span>
                            </span>
                        </CardTitle>
                        <CardContent className='ps-4'>
                            <span className='text-xl font-bold font-primary'>{currencyNotation(total_spending)}</span>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardTitle className='flex items-center justify-between p-4 font-secondary'>
                            <span className='text-sm text-muted-foreground flex items-center'>
                                {net_flow >= 0 ? (
                                    <TrendingUp className='h-3.5 w-3.5 mr-1' />
                                ) : (
                                    <TrendingDown className='h-3.5 w-3.5 mr-1' />
                                )}
                                Net Balance
                            </span>
                            <span className='text-sm font-medium'>
                                <span className='mr-1'>
                                    {current_month.net_change >= 0 ? (
                                        <ArrowUpRight className='inline h-3.5 w-3.5 text-green-600 dark:text-green-400' />
                                    ) : (
                                        <ArrowDownRight className='inline h-3.5 w-3.5 text-red-600 dark:text-green-400' />
                                    )}
                                </span>
                                <span className='font-primary'>{current_month.net_change.toFixed(1)}%</span>
                            </span>
                        </CardTitle>
                        <CardContent className='ps-4'>
                            <span className='text-xl font-bold font-primary'>{currencyNotation(net_flow)}</span>
                        </CardContent>
                    </Card>
                </div>

                <Separator
                    orientation='horizontal'
                    className='w-full bg-muted h-0.5 my-6 rounded'
                />

                <div>
                    <div className='space-y-2'>
                        <div className='flex items-center justify-between text-sm'>
                            <span>
                                <CalendarDays className='inline h-3.5 w-3.5 me-1.5 mb-0.5' />
                                <span>This Month’s Progress</span>
                            </span>
                            <span>{current_month.days_tracked} days tracked</span>
                        </div>
                        <Progress
                            value={
                                (current_month.days_tracked /
                                    getDaysInMonth(new Date().getMonth(), new Date().getFullYear())) *
                                100
                            }
                            className='h-2'
                        />
                        <div className='flex justify-between text-xs text-muted-foreground mt-0.5'>
                            <span>Day 1</span>
                            <span>Day 15</span>
                            <span>Day {getDaysInMonth(new Date().getMonth(), new Date().getFullYear())}</span>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm mt-8'>
                        <Card>
                            <CardHeader className='p-4'>
                                <CardTitle className='flex items-center font-secondary'>
                                    <DollarSign className='h-4 w-4 mr-1.5 text-green-500' />
                                    <span>This month's income</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='text-xl font-medium font-primary'>
                                {currencyNotation(current_month.income)}
                                <span className='text-sm text-muted-foreground ms-3'>earned</span>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className='p-4'>
                                <CardTitle className='flex items-center font-secondary'>
                                    <DollarSign className='h-4 w-4 mr-1.5 text-red-500' />
                                    <span>This month's expenses</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='text-xl font-medium font-primary'>
                                {currencyNotation(current_month.spending)}
                                <span className='text-sm text-muted-foreground ms-3'>spent</span>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className='p-4'>
                                <CardTitle className='flex items-center font-secondary'>
                                    {current_month.net >= 0 ? (
                                        <TrendingUp className='h-4 w-4 mr-1.5 text-green-500' />
                                    ) : (
                                        <TrendingDown className='h-4 w-4 mr-1.5 text-red-500' />
                                    )}
                                    <span>Net Change</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent
                                className={`text-xl font-medium font-primary ${
                                    current_month.net >= 0
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-red-600 dark:text-red-400"
                                }`}>
                                {currencyNotation(current_month.net)}
                                <span className='ms-2 text-xs font-secondary'>
                                    {current_month.net >= 0 ? (
                                        <ArrowUpRight className='h-4 w-4 inline' />
                                    ) : (
                                        <ArrowDownRight className='h-4 w-4 inline' />
                                    )}
                                    <span className='ms-0.5 font-primary'>{current_month.net_change.toFixed(1)}%</span>
                                    <span className='text-muted-foreground ms-2'>from last month</span>
                                </span>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className='p-4'>
                                <CardTitle className='flex items-center font-secondary'>
                                    <BarChart3 className='h-4 w-4 mr-1.5 text-blue-500' />
                                    <span>Daily Avg. Spending</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='text-xl font-medium font-primary'>
                                {currencyNotation(current_month.avg_daily_spending)}
                                <span className='ms-2 text-sm text-muted-foreground font-primary'>per day</span>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default FinancialSummaryCard;
