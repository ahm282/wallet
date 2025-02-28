import type { GoalForm, GoalFormErrors } from "@/types/goals.types";

export const validateGoalForm = (form: GoalForm): { isValid: boolean; errors: GoalFormErrors } => {
    let isValid = true;
    const errors: GoalFormErrors = {
        name: "",
        targetAmount: "",
        currentAmount: "",
        targetDate: "",
    };

    if (!form.name.trim()) {
        errors.name = "Name is required";
        isValid = false;
    }

    if (!form.targetAmount) {
        errors.targetAmount = "Target is required";
        isValid = false;
    } else if (isNaN(Number(form.targetAmount))) {
        errors.targetAmount = "Target must be a valid number";
        isValid = false;
    } else if (Number(form.targetAmount) < 0) {
        errors.targetAmount = "Target cannot be negative";
        isValid = false;
    }

    // 'currentAmount' is optional; if provided, it must be a valid, non-negative number
    if (form.currentAmount) {
        if (isNaN(Number(form.currentAmount))) {
            errors.currentAmount = "currentAmount progress must be a valid number";
            isValid = false;
        } else if (Number(form.currentAmount) < 0) {
            errors.currentAmount = "currentAmount progress cannot be negative";
            isValid = false;
        } else if (Number(form.currentAmount) > Number(form.targetAmount)) {
            errors.currentAmount = "currentAmount progress cannot exceed the target";
            isValid = false;
        }
    }

    if (!form.targetDate) {
        errors.targetDate = "Target date is required";
        isValid = false;
    }

    return { isValid, errors };
};
