import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    BarChart3,
    LineChart as LineChartIcon,
    PieChart as PieChartIcon,
    TrendingUp,
    AlertCircle,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
    BarChart as ReBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";
import { fetchInsightsData } from "@/api/insights";
import { getUserId, currencyNotation } from "@/lib/utils";
import { InsightsData, TrendsData } from "@/types/insights.types";

// Fallback
const DEFAULT_SUMMARY: InsightsData["summary"] = {
    total_income: 0,
    total_expenses: 0,
    net_cashflow: 0,
    transaction_count: 0,
    average_transaction: 0,
};

const DEFAULT_TRENDS: TrendsData = {
    income_change_pct: 0,
    expense_change_pct: 0,
};

export const InsightsPage = () => {
    const { data, isLoading, isError, error } = useQuery<InsightsData, Error>({
        queryKey: ["insightsData", getUserId()],
        queryFn: () => fetchInsightsData() as Promise<InsightsData>,
    });

    useEffect(() => {
        document.title = "Financial Insights | Wallet";
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <div className='flex justify-center items-center font-primary text-center h-64'>Loading insights...</div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className='w-6/12 mx-auto p-4 mt-10 bg-red-100 text-red-600 font-primary text-center rounded-md'>
                Error fetching insights: {error?.message || "Unknown error"}
            </div>
        );
    }

    const insightsData: InsightsData = data || {};
    const summary = insightsData.summary || DEFAULT_SUMMARY;
    const categoryBreakdown = insightsData.category_breakdown || { top_categories: [] };
    const topCategories = categoryBreakdown.top_categories || [];
    const monthlyTrends = insightsData.monthly_trends || { monthly_data: {}, trends: DEFAULT_TRENDS };
    const budgetPerformance = insightsData.budget_performance || {};
    const anomalies = insightsData.anomalies || [];
    const spendingPatterns = insightsData.spending_patterns || { by_day_of_week: {} };
    const incomeAnalysis = insightsData.income_analysis || { income_sources: {} };
    const netChangePercent = (monthlyTrends.trends.income_change_pct - monthlyTrends.trends.expense_change_pct).toFixed(
        2
    );
    const isPositiveChange = parseFloat(netChangePercent) >= 0;
    const pieChartData = topCategories.map((cat) => ({
        name: cat.name,
        value: cat.amount,
    }));
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

    // Prepare monthly data for charts
    const monthlyChartData = Object.entries(monthlyTrends?.monthly_data || {}).map(([month, data]) => ({
        name: month.substring(5),
        income: data.income,
        expenses: data.expenses,
        net: data.net,
    }));

    // Prepare day of week data
    const dayOfWeekData = Object.entries(spendingPatterns?.by_day_of_week || {}).map(([day, amount]) => ({
        day,
        amount,
    }));

    // Income sources data for chart
    const incomeSourcesData = Object.entries(incomeAnalysis?.income_sources || {}).map(([source, data]) => ({
        name: source,
        value: data.sum,
    }));

    // Placeholder message component
    const EmptyState = ({ message }: { message: string }) => (
        <div className='h-64 flex items-center justify-center border border-dashed rounded-md'>
            <span className='text-muted-foreground'>{message}</span>
        </div>
    );

    return (
        <div className='w-11/12 md:w-10/12 lg:max-w-4xl 2xl:max-w-5xl my-8 mx-auto flex flex-col space-y-5'>
            <Card>
                <CardHeader className='space-y-0 pb-4'>
                    <CardTitle className='text-2xl font-bold flex flex-row items-center justify-between'>
                        <div className='flex items-center font-primary text-2xl font-bold'>
                            <TrendingUp className='size-7 me-3' />
                            Financial Insights
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-sm text-muted-foreground mb-4'>
                        Gain valuable insights into your financial habits and trends.
                    </p>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium'>Total Income</CardTitle>
                                <DollarSign className='h-4 w-4 text-muted-foreground' />
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>{currencyNotation(summary.total_income)}</div>
                                <p className='text-xs text-muted-foreground'>
                                    {monthlyTrends.trends.income_change_pct >= 0 ? (
                                        <span className='text-green-600'>
                                            <ArrowUpRight className='inline h-4 w-4' />
                                            {monthlyTrends.trends.income_change_pct.toFixed(2)}% from last month
                                        </span>
                                    ) : (
                                        <span className='text-red-600'>
                                            <ArrowDownRight className='inline h-4 w-4' />
                                            {Math.abs(monthlyTrends.trends.income_change_pct).toFixed(2)}% from last
                                            month
                                        </span>
                                    )}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium'>Total Expenses</CardTitle>
                                <DollarSign className='h-4 w-4 text-muted-foreground' />
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>{currencyNotation(summary.total_expenses)}</div>
                                <p className='text-xs text-muted-foreground'>
                                    {monthlyTrends.trends.expense_change_pct >= 0 ? (
                                        <span className='text-red-600'>
                                            <ArrowUpRight className='inline h-4 w-4' />
                                            {monthlyTrends.trends.expense_change_pct.toFixed(2)}% from last month
                                        </span>
                                    ) : (
                                        <span className='text-green-600'>
                                            <ArrowDownRight className='inline h-4 w-4' />
                                            {Math.abs(monthlyTrends.trends.expense_change_pct).toFixed(2)}% from last
                                            month
                                        </span>
                                    )}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium'>Net Cashflow</CardTitle>
                                <TrendingUp className='h-4 w-4 text-muted-foreground' />
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>{currencyNotation(summary.net_cashflow)}</div>
                                <p className='text-xs text-muted-foreground'>
                                    {isPositiveChange ? (
                                        <span className='text-green-600'>
                                            <ArrowUpRight className='inline h-4 w-4' />
                                            {netChangePercent}% from last month
                                        </span>
                                    ) : (
                                        <span className='text-red-600'>
                                            <ArrowDownRight className='inline h-4 w-4' />
                                            {netChangePercent}% from last month
                                        </span>
                                    )}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium'>Average Transaction</CardTitle>
                                <DollarSign className='h-4 w-4 text-muted-foreground' />
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>
                                    {currencyNotation(summary.average_transaction)}
                                </div>
                                <p className='text-xs text-muted-foreground'>
                                    {summary.transaction_count} transactions
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <Card className='h-96'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-lg font-medium'>Spending Categories</CardTitle>
                        <PieChartIcon className='size-5 text-muted-foreground' />
                    </CardHeader>
                    <CardContent className='pt-2'>
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
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => currencyNotation(value as number)} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <EmptyState message='No category data available' />
                        )}
                    </CardContent>
                </Card>

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
                                        <defs>
                                            <linearGradient
                                                id='gradientIncome'
                                                x1='0'
                                                y1='0'
                                                x2='0'
                                                y2='1'>
                                                <stop
                                                    offset='5%'
                                                    stopColor='#00ff41'
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset='95%'
                                                    stopColor='#00ff41'
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
                                        <CartesianGrid strokeDasharray='3 3' />
                                        <XAxis
                                            dataKey={"name"}
                                            tick={{ fontSize: 14 }}
                                            tickLine={false}
                                        />
                                        <YAxis />
                                        <Tooltip formatter={(value) => currencyNotation(value as number)} />
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
                                            stackId='1'
                                            stroke='#00ff41'
                                            fill='url(#gradientIncome)'
                                            strokeWidth={2}
                                        />
                                        <Area
                                            type='monotone'
                                            dataKey='expenses'
                                            stackId='2'
                                            stroke='#ff4a4a'
                                            fill='url(#gradientExpenses)'
                                            strokeWidth={2}
                                        />
                                        <Area
                                            type='monotone'
                                            dataKey='net'
                                            stackId='3'
                                            stroke='#00bfff'
                                            fill='url(#gradientNet)'
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <EmptyState message='No trend data available' />
                        )}
                        {monthlyTrends?.trends && (
                            <div className='mt-2 py-2 border-t flex justify-between text-sm'>
                                <div className='flex items-center'>
                                    <span className='mr-1'>Income:</span>
                                    <span
                                        className={
                                            (monthlyTrends.trends?.income_change_pct || 0) >= 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }>
                                        {(monthlyTrends.trends?.income_change_pct || 0) >= 0 ? (
                                            <ArrowUpIcon className='inline h-3 w-3' />
                                        ) : (
                                            <ArrowDownIcon className='inline h-3 w-3' />
                                        )}
                                        {Math.abs(monthlyTrends.trends?.income_change_pct || 0).toFixed(1)}%
                                    </span>
                                </div>
                                <div className='flex items-center'>
                                    <span className='mr-1'>Expenses:</span>
                                    <span
                                        className={
                                            (monthlyTrends.trends?.expense_change_pct || 0) <= 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }>
                                        {(monthlyTrends.trends?.expense_change_pct || 0) <= 0 ? (
                                            <ArrowDownIcon className='inline h-3 w-3' />
                                        ) : (
                                            <ArrowUpIcon className='inline h-3 w-3' />
                                        )}
                                        {Math.abs(monthlyTrends.trends?.expense_change_pct || 0).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
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
                                    <ReBarChart
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
                                    </ReBarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <EmptyState message='No weekly spending data available' />
                        )}
                    </CardContent>
                </Card>

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
                                                    fill={COLORS[index % COLORS.length]}
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
            </div>

            <Separator
                orientation='horizontal'
                className='w-full bg-muted h-0.5 my-2 rounded'
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
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

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-lg font-medium'>Unusual Spending</CardTitle>
                        <AlertCircle className='size-5 text-muted-foreground' />
                    </CardHeader>
                    <CardContent className='pt-2'>
                        {anomalies.length > 0 ? (
                            <div className='space-y-4'>
                                {anomalies.map((anomaly, index) => (
                                    <div
                                        key={index}
                                        className='p-3 border rounded-lg'>
                                        <div className='flex justify-between items-start'>
                                            <div>
                                                <p className='font-medium'>{anomaly.description}</p>
                                                <p className='text-sm text-muted-foreground'>
                                                    {anomaly.category} • {new Date(anomaly.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className='font-semibold text-red-500'>
                                                {currencyNotation(anomaly.amount)}
                                            </span>
                                        </div>
                                        <div className='text-xs text-muted-foreground mt-1'>
                                            {anomaly.deviation.toFixed(1)}x higher than usual
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState message='No anomalies detected' />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default InsightsPage;
