import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Coins, CreditCard, ArrowUpDown, Receipt } from "lucide-react";
import { currencyNotation } from "@/lib/utils";
import { InsightsData, TrendsData } from "@/types/insights.types";

interface Props {
    summary: InsightsData["summary"];
    trends: TrendsData;
    netChangePercent: string;
    isPositiveChange: boolean;
}

export const SummaryCards = ({ summary, trends, netChangePercent, isPositiveChange }: Props) => {
    const renderCurrency = (value: number | null | undefined) =>
        value != null && !isNaN(value) ? currencyNotation(value) : "";

    const renderPercent = (value: number | null | undefined) =>
        value != null && !isNaN(value) ? `${Math.abs(value).toFixed(2)}% from last month` : "";

    return (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
            {/* Income */}
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Total Income</CardTitle>
                    <Coins className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{renderCurrency(summary?.total_income)}</div>
                    <p className='text-xs mt-2 text-muted-foreground'>
                        {trends.income_change_pct != null && !isNaN(trends.income_change_pct) ? (
                            trends.income_change_pct >= 0 ? (
                                <span className='text-green-600'>
                                    <ArrowUpRight className='inline h-4 w-4' />{" "}
                                    {renderPercent(trends.income_change_pct)}
                                </span>
                            ) : (
                                <span className='text-red-600'>
                                    <ArrowDownRight className='inline h-4 w-4' />{" "}
                                    {renderPercent(trends.income_change_pct)}
                                </span>
                            )
                        ) : (
                            ""
                        )}
                    </p>
                </CardContent>
            </Card>
            {/* Expenses */}
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Total Expenses</CardTitle>
                    <CreditCard className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{renderCurrency(summary?.total_expenses)}</div>
                    <p className='text-xs mt-2 text-muted-foreground'>
                        {trends.expense_change_pct != null && !isNaN(trends.expense_change_pct) ? (
                            trends.expense_change_pct >= 0 ? (
                                <span className='text-red-600'>
                                    <ArrowUpRight className='inline h-4 w-4' />{" "}
                                    {renderPercent(trends.expense_change_pct)}
                                </span>
                            ) : (
                                <span className='text-green-600'>
                                    <ArrowDownRight className='inline h-4 w-4' />{" "}
                                    {renderPercent(trends.expense_change_pct)}
                                </span>
                            )
                        ) : (
                            ""
                        )}
                    </p>
                </CardContent>
            </Card>
            {/* Net Cashflow */}
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Net Cashflow</CardTitle>
                    <ArrowUpDown className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{renderCurrency(summary?.net_cashflow)}</div>
                    <p className='text-xs mt-2 text-muted-foreground'>
                        {!isNaN(parseFloat(netChangePercent)) && parseFloat(netChangePercent) != 0 ? (
                            isPositiveChange ? (
                                <span className='text-green-600'>
                                    <ArrowUpRight className='inline h-4 w-4' /> {netChangePercent}% from last month
                                </span>
                            ) : (
                                <span className='text-red-600'>
                                    <ArrowDownRight className='inline h-4 w-4' /> {netChangePercent}% from last month
                                </span>
                            )
                        ) : (
                            ""
                        )}
                    </p>
                </CardContent>
            </Card>
            {/* Average Transaction */}
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Average Transaction</CardTitle>
                    <Receipt className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{renderCurrency(summary?.average_transaction)}</div>
                    <p className='text-xs mt-2 text-muted-foreground'>
                        {summary?.transaction_count != null ? summary.transaction_count : ""}{" "}
                        {summary?.transaction_count != 1 ? "transactions" : "transaction"} this month
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default SummaryCards;
