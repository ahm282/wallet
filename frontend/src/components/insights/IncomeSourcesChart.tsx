import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart as LineChartIcon } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { currencyNotation } from "@/lib/utils";
import { EmptyState } from "./EmptyState";

interface Props {
    incomeSourcesData: { name: string; value: number }[];
    colors: string[];
}

export const IncomeSourcesChart = ({ incomeSourcesData, colors }: Props) => {
    return (
        <Card className='h-96'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-lg font-medium'>Income Sources</CardTitle>
                <LineChartIcon className='size-5 text-muted-foreground' />
            </CardHeader>
            <CardContent className='pt-2'>
                {incomeSourcesData.length > 0 ? (
                    <div className='h-72'>
                        <ResponsiveContainer
                            width='100%'
                            height='100%'>
                            <PieChart>
                                <Pie
                                    data={incomeSourcesData}
                                    cx='50%'
                                    cy='50%'
                                    labelLine={true}
                                    outerRadius={80}
                                    fill='#8884d8'
                                    dataKey='value'>
                                    {incomeSourcesData.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={colors[index % colors.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => currencyNotation(value as number)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <EmptyState message='No income source data available' />
                )}
            </CardContent>
        </Card>
    );
};

export default IncomeSourcesChart;
