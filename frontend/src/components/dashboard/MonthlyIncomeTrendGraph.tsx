import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { type ChartConfig } from "@/components/ui/chart";
import { currencyNotation } from "@/lib/utils";

const chartConfig = {
    income: {
        color: "hsl(142 76% 36%)",
    },
} satisfies ChartConfig;

export const MonthlyIncomeTrendGraph = ({ data }: { data: Record<string, number> }) => {
    // Convert data object to array of chart data
    const chartData = Object.entries(data).map(([month, amount]) => ({
        month,
        income: Number(amount),
    }));

    // Calculate month-over-month change
    const lastTwoMonths = chartData.slice(-2);
    const percentChange =
        lastTwoMonths.length === 2
            ? ((lastTwoMonths[1].income - lastTwoMonths[0].income) / lastTwoMonths[0].income) * 100
            : 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Income Trend</CardTitle>
                <CardDescription>
                    {percentChange !== 0 && (
                        <span
                            className={
                                percentChange > 0
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                            }>
                            {percentChange > 0 ? "↑" : "↓"} {Math.abs(percentChange).toFixed(1)}% from previous month
                        </span>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer
                    width='100%'
                    height={300}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                        className='group'>
                        <CartesianGrid
                            strokeDasharray='3 3'
                            vertical={false}
                            className='stroke-gray-200 dark:stroke-gray-700'
                        />
                        <XAxis
                            dataKey='month'
                            tickLine={false}
                            tickMargin={10}
                            tickFormatter={(value) => {
                                const [year, month] = value.split("-");
                                return `${month}/${year.slice(2)}`;
                            }}
                            className='fill-gray-500 dark:fill-gray-300'
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `€${value.toLocaleString()}`}
                            className='fill-gray-500 dark:fill-gray-300'
                        />
                        <Tooltip
                            cursor={{
                                fill: "rgba(0,0,0,0.05)",
                                className:
                                    "transition-colors duration-100 ease-in-out group-hover:fill-[rgba(0,0,0,0.1)]",
                            }}
                            formatter={(value: number) => [`${currencyNotation(value).toLocaleString()}`, "Income"]}
                            labelClassName='font-semibold dark:text-black'
                            labelFormatter={(value) => {
                                const [year, month] = value.split("-");
                                const date = new Date(year, Number.parseInt(month) - 1);
                                return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
                            }}
                        />
                        <Bar
                            dataKey='income'
                            fill={chartConfig.income.color}
                            radius={[8, 8, 0, 0]}
                            name='Income'
                            className='transition-colors duration-100 ease-in-out hover:fill-[hsl(142_76%_26%)]'
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default MonthlyIncomeTrendGraph;
