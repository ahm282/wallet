import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { EmptyState } from "./EmptyState";
import { currencyNotation } from "@/lib/utils";
import { TrendsData, MonthlyData } from "@/types/insights.types";

interface Props {
    monthlyData: Record<string, MonthlyData>;
    trends: TrendsData;
}

export const IncomeExpensesChart = ({ monthlyData, trends }: Props) => {
    const monthlyChartData = Object.entries(monthlyData).map(([month, data]) => ({
        name: month.substring(5),
        income: data.income,
        expenses: data.expenses,
        net: data.net,
    }));

    return (
        <Card className='h-96'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-lg font-medium'>Income vs. Expenses</CardTitle>
                <BarChart3 className='size-5 text-muted-foreground' />
            </CardHeader>
            <CardContent className='pt-2'>
                {monthlyChartData.length > 0 ? (
                    <div className='h-64'>
                        <ResponsiveContainer
                            width='100%'
                            height='100%'>
                            <AreaChart
                                data={monthlyChartData}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis
                                    dataKey={"name"}
                                    tick={{ fontSize: 14 }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fontFamily: "poppins", fontWeight: "bold" }}
                                    tickLine={false}
                                    tickFormatter={(value) => currencyNotation(value as number)}
                                />
                                <Tooltip
                                    formatter={(value) => currencyNotation(value as number)}
                                    labelFormatter={(value) => `Month: ${value}`}
                                    separator={": "}
                                    labelStyle={{
                                        fontFamily: "poppins",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        color: "#f0f0f0",
                                    }}
                                    contentStyle={{
                                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                                        border: "1px solid #f0f0f0",
                                        alignSelf: "center",
                                        fontFamily: "poppins",
                                    }}
                                    itemStyle={{ fontSize: "14px" }}
                                />
                                <Legend
                                    wrapperStyle={{
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        fontFamily: "poppins",
                                        textTransform: "capitalize",
                                    }}
                                />
                                <Area
                                    type='monotone'
                                    dataKey='income'
                                    stroke='#00ff41'
                                    fill='url(#gradientIncome)'
                                    strokeWidth={2}
                                />
                                <Area
                                    type='monotone'
                                    dataKey='expenses'
                                    stroke='#ff4a4a'
                                    fill='url(#gradientExpenses)'
                                    strokeWidth={2}
                                />
                                <Area
                                    type='monotone'
                                    dataKey='net'
                                    stroke='#00bfff'
                                    fill='url(#gradientNet)'
                                    strokeWidth={2}
                                />
                                <defs>
                                    <linearGradient
                                        id='gradientIncome'
                                        x1='0'
                                        y1='0'
                                        x2='0'
                                        y2='1'>
                                        <stop
                                            offset='5%'
                                            stopColor='#10b981'
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset='95%'
                                            stopColor='#10b981'
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                    <linearGradient
                                        id='gradientExpenses'
                                        x1='0'
                                        y1='0'
                                        x2='0'
                                        y2='1'>
                                        <stop
                                            offset='5%'
                                            stopColor='#ff4a4a'
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset='95%'
                                            stopColor='#ff4a4a'
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                    <linearGradient
                                        id='gradientNet'
                                        x1='0'
                                        y1='0'
                                        x2='0'
                                        y2='1'>
                                        <stop
                                            offset='5%'
                                            stopColor='#00bfff'
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset='95%'
                                            stopColor='#00bfff'
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <EmptyState message='No trend data available' />
                )}
                {trends && (
                    <div className='mt-2 py-2 border-t flex justify-between text-sm'>
                        <div className='flex items-center'>
                            <span className='mr-1'>Income:</span>
                            <span className={trends.income_change_pct >= 0 ? "text-green-600" : "text-red-600"}>
                                {trends.income_change_pct >= 0 ? (
                                    <ArrowUpIcon className='inline h-3 w-3' />
                                ) : (
                                    <ArrowDownIcon className='inline h-3 w-3' />
                                )}
                                {Math.abs(trends.income_change_pct).toFixed(1)}%
                            </span>
                        </div>
                        <div className='flex items-center'>
                            <span className='mr-1'>Expenses:</span>
                            <span className={trends.expense_change_pct <= 0 ? "text-green-600" : "text-red-600"}>
                                {trends.expense_change_pct <= 0 ? (
                                    <ArrowDownIcon className='inline h-3 w-3' />
                                ) : (
                                    <ArrowUpIcon className='inline h-3 w-3' />
                                )}
                                {Math.abs(trends.expense_change_pct).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default IncomeExpensesChart;
