export interface CategoryData {
    name: string;
    amount: number;
}

export interface MonthlyData {
    income: number;
    expenses: number;
    net: number;
}

export interface TrendsData {
    income_change_pct: number;
    expense_change_pct: number;
}

export interface BudgetData {
    budgeted: number;
    spent: number;
    percentage_used: number;
    status: "on_track" | "over_budget" | "under_budget";
}

export interface AnomalyData {
    description: string;
    category: string;
    date: string;
    amount: number;
    deviation: number;
}

export interface IncomeSource {
    sum: number;
    count: number;
}

export interface InsightsData {
    summary?: {
        total_income: number;
        total_expenses: number;
        net_cashflow: number;
        transaction_count: number;
        average_transaction: number;
    };
    category_breakdown?: {
        top_categories: CategoryData[];
    };
    monthly_trends?: {
        monthly_data: Record<string, MonthlyData>;
        trends: TrendsData;
    };
    budget_performance?: Record<string, BudgetData>;
    anomalies?: AnomalyData[];
    spending_patterns?: {
        by_day_of_week: Record<string, number>;
    };
    income_analysis?: {
        income_sources: Record<string, IncomeSource>;
    };
}
