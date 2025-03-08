import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { fetchInsightsData } from "@/api/insights";
import { getUserId } from "@/lib/utils";
import { InsightsData, TrendsData } from "@/types/insights.types";
import {
    SummaryCards,
    SpendingCategories,
    IncomeExpensesChart,
    WeeklySpending,
    IncomeSourcesChart,
    BudgetPerformance,
    AnomaliesCard,
} from "@/components/insights/index";

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
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

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
                    <SummaryCards
                        summary={summary}
                        trends={monthlyTrends.trends}
                        netChangePercent={netChangePercent}
                        isPositiveChange={isPositiveChange}
                    />
                </CardContent>
            </Card>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <SpendingCategories
                    topCategories={topCategories}
                    colors={COLORS}
                />
                <IncomeExpensesChart
                    monthlyData={monthlyTrends.monthly_data}
                    trends={monthlyTrends.trends}
                />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <WeeklySpending dayOfWeekData={dayOfWeekData} />
                <IncomeSourcesChart
                    incomeSourcesData={incomeSourcesData}
                    colors={COLORS}
                />
            </div>

            <Separator
                orientation='horizontal'
                className='w-full bg-muted h-0.5 my-2 rounded'
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <BudgetPerformance budgetPerformance={budgetPerformance} />
                <AnomaliesCard anomalies={anomalies} />
            </div>
        </div>
    );
};

export default InsightsPage;
