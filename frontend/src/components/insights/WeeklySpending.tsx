import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { currencyNotation } from "@/lib/utils";
import { EmptyState } from "./EmptyState";

interface Props {
    dayOfWeekData: { day: string; amount: number }[];
}

export const WeeklySpending = ({ dayOfWeekData }: Props) => {
    return (
        <Card className='h-96'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-lg font-medium'>Weekly Spending</CardTitle>
                <BarChart3 className='size-5 text-muted-foreground' />
            </CardHeader>
            <CardContent className='pt-2'>
                {dayOfWeekData.length > 0 ? (
                    <div className='h-72'>
                        <ResponsiveContainer
                            width='100%'
                            height='100%'>
                            <BarChart
                                data={dayOfWeekData}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis
                                    dataKey='day'
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: "#9CA3AF" }}
                                    style={{ fontSize: "0.75rem" }}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: "#9CA3AF" }}
                                    style={{ fontSize: "0.75rem" }}
                                    tickFormatter={(value) => currencyNotation(value as number)}
                                />
                                <Tooltip
                                    formatter={(value) => currencyNotation(value as number)}
                                    labelFormatter={(value) => `Day: ${value}`}
                                    labelStyle={{ color: "#fff", fontFamily: "poppins" }}
                                    cursor={{
                                        fill: "rgba(0,0,0,0.05)",
                                        className:
                                            "transition-colors duration-100 ease-in-out group-hover:fill-[rgba(0,0,0,0.1)]",
                                    }}
                                    contentStyle={{
                                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                                        border: "1px solid #D1D5DB",
                                        fontFamily: "poppins",
                                    }}
                                />
                                <Bar
                                    dataKey='amount'
                                    fill='url(#weeklySpendingGradient)'
                                    barSize={30}
                                    radius={[4, 4, 0, 0]}
                                />
                                <defs>
                                    <linearGradient
                                        id='weeklySpendingGradient'
                                        x1='0'
                                        y1='0'
                                        x2='0'
                                        y2='1'>
                                        <stop
                                            offset='0%'
                                            stopColor='#6EE7B7'
                                        />{" "}
                                        // Dark slate gray
                                        <stop
                                            offset='100%'
                                            stopColor='#3B82F6'
                                        />{" "}
                                        // Lighter gray
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <EmptyState message='No weekly spending data available' />
                )}
            </CardContent>
        </Card>
    );
};

export default WeeklySpending;
