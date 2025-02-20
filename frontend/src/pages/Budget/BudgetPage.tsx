import { useState, useEffect } from "react";
import { NoBudget } from "@/components/budget/NoBudget";
import { BudgetDataExists } from "@/components/budget/BudgetDataExists";
import type { Budget } from "@/types/budget.types";

export const BudgetPage = () => {
    // Sample budgets data
    const sampleBudgets = [
        { id: 1, name: "Healthcare", budgeted: 400, spent: 85 },
        { id: 2, name: "Food", budgeted: 600, spent: 450 },
        { id: 3, name: "Transportation", budgeted: 400, spent: 350 },
        { id: 4, name: "Utilities", budgeted: 300, spent: 280 },
        { id: 5, name: "Entertainment", budgeted: 200, spent: 180 },
    ];

    const [budgets, setBudgets] = useState<Budget[]>(sampleBudgets);
    const hasBudgetData = budgets.length > 0;

    /*
     * Sets the title of the page to "Budgets | Wallet" when the component mounts
     */
    useEffect(() => {
        document.title = "Monthly Budgets | Wallet";
    }, []);

    return hasBudgetData ? (
        <BudgetDataExists
            budgets={budgets}
            setBudgets={setBudgets}
        />
    ) : (
        <NoBudget
            budgets={budgets}
            setBudgets={setBudgets}
        />
    );
};

export default BudgetPage;
