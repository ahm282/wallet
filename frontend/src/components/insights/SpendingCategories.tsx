import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChartIcon } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { currencyNotation } from "@/lib/utils";
import { EmptyState } from "./EmptyState";
import { CategoryData } from "@/types/insights.types";

interface Props {
    topCategories: CategoryData[];
    colors: string[];
}

const pieChartStyles = `
  .recharts-sector:hover {
    opacity: 0.8;
    transition: opacity 0.25s ease;
  }
`;

export const SpendingCategories = ({ topCategories, colors }: Props) => {
    const pieChartData = topCategories.map((cat) => ({
        name: cat.name,
        value: cat.amount,
    }));

    return (
        <Card className='h-96'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-lg font-medium'>Spending Categories</CardTitle>
                <PieChartIcon className='size-5 text-muted-foreground' />
            </CardHeader>
            <CardContent className='pt-2'>
                <style>{pieChartStyles}</style>
                {topCategories.length > 0 ? (
                    <div className='h-72'>
                        <ResponsiveContainer
                            width='100%'
                            height='100%'>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx='50%'
                                    cy='50%'
                                    labelLine={false}
                                    outerRadius={80}
                                    fill='#8884d8'
                                    dataKey='value'
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}>
                                    {pieChartData.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={colors[index % colors.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => currencyNotation(value as number)}
                                    contentStyle={{ fontFamily: "poppins" }}
                                />
                                <Legend
                                    align='center'
                                    height={36}
                                    iconSize={12}
                                    iconType='circle'
                                    wrapperStyle={{ fontSize: "0.85rem", fontFamily: "poppins" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <EmptyState message='No category data available' />
                )}
            </CardContent>
        </Card>
    );
};

export default SpendingCategories;
