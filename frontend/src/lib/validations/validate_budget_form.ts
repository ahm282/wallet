import type { BudgetFormErrors, NewBudget } from "@/types/budget.types";

export const validateBudgetForm = (newBudget: NewBudget): { isValid: boolean; errors: BudgetFormErrors } => {
    let isValid = true;
    const errors: BudgetFormErrors = {
        name: "",
        budgeted: "",
        spent: "",
    };

    if (!newBudget.name.trim()) {
        errors.name = "Name is required";
        isValid = false;
    }

    if (!newBudget.budgeted) {
        errors.budgeted = "Budget is required";
        isValid = false;
    } else if (isNaN(Number(newBudget.budgeted))) {
        errors.budgeted = "Budget must be a valid number";
        isValid = false;
    }

    if (newBudget.spent && isNaN(Number(newBudget.spent))) {
        errors.spent = "Spent must be a valid number";
        isValid = false;
    }

    if (newBudget.budgeted && Number(newBudget.budgeted) < 0) {
        errors.budgeted = "Budget cannot be negative";
        isValid = false;
    }

    if (Number(newBudget.spent) > Number(newBudget.budgeted)) {
        errors.spent = "Spent cannot be greater than budgeted";
        isValid = false;
    }

    if (newBudget.spent && Number(newBudget.spent) < 0) {
        errors.spent = "Spent cannot be negative";
        isValid = false;
    }

    return { isValid, errors };
};

export default validateBudgetForm;
