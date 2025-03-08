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
                                <XAxis dataKey='day' />
                                <YAxis />
                                <Tooltip formatter={(value) => currencyNotation(value as number)} />
                                <Bar
                                    dataKey='amount'
                                    fill='#8884d8'
                                />
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
