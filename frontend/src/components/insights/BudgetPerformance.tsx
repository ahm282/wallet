import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart as LineChartIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { currencyNotation } from "@/lib/utils";
import { EmptyState } from "./EmptyState";
import { BudgetData } from "@/types/insights.types";

interface Props {
    budgetPerformance: Record<string, BudgetData>;
}

export const BudgetPerformance = ({ budgetPerformance }: Props) => {
    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-lg font-medium'>Budget Performance</CardTitle>
                <LineChartIcon className='size-5 text-muted-foreground' />
            </CardHeader>
            <CardContent className='pt-2'>
                {Object.keys(budgetPerformance).length > 0 ? (
                    <div>
                        <div className='space-y-4'>
                            {Object.entries(budgetPerformance)
                                .filter(([_, value]) => value.status === "over_budget")
                                .slice(0, 5)
                                .map(([category, value], index) => (
                                    <div
                                        key={index}
                                        className='space-y-1'>
                                        <div className='flex items-center justify-between'>
                                            <span className='text-sm font-medium'>{category}</span>
                                            <span className='text-sm text-red-600'>
                                                {value.percentage_used.toFixed(0)}% used
                                            </span>
                                        </div>
                                        <Progress
                                            value={Math.min(value.percentage_used, 100)}
                                            className={`h-2 bg-gray-200 ${
                                                value.percentage_used > 90
                                                    ? "[&>div]:bg-red-600"
                                                    : value.percentage_used > 70
                                                    ? "[&>div]:bg-amber-500"
                                                    : "[&>div]:bg-green-600"
                                            }`}
                                        />
                                        <div className='flex justify-between text-xs text-muted-foreground'>
                                            <span>Budget: {currencyNotation(value.budgeted)}</span>
                                            <span>Spent: {currencyNotation(value.spent)}</span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <Separator className='w-full bg-muted h-0.5 my-6 rounded' />
                        {/* On track budgets section */}
                        <div>
                            <h3 className='font-bold mb-3 font-primary'>On Track Budgets</h3>
                            {Object.entries(budgetPerformance)
                                .filter(([_, value]) => value.status === "on_track")
                                .slice(0, 3)
                                .map(([category, value], index) => (
                                    <div
                                        key={index}
                                        className='space-y-1 mb-3'>
                                        <div className='flex items-center justify-between'>
                                            <span className='text-sm font-medium'>{category}</span>
                                            <span className='text-sm text-green-600'>
                                                {value.percentage_used.toFixed(0)}% used
                                            </span>
                                        </div>
                                        <Progress
                                            value={value.percentage_used}
                                            className='h-2 bg-gray-200 [&>div]:bg-green-500'
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>
                ) : (
                    <EmptyState message='No budget data available' />
                )}
            </CardContent>
        </Card>
    );
};

export default BudgetPerformance;
