import type { GoalForm, GoalFormErrors } from "@/types/types";

export const validateGoalForm = (form: GoalForm): { isValid: boolean; errors: GoalFormErrors } => {
    let isValid = true;
    const errors: GoalFormErrors = { name: "", target: "", current: "", targetDate: "" };

    if (!form.name.trim()) {
        errors.name = "Name is required";
        isValid = false;
    }

    if (!form.target) {
        errors.target = "Target is required";
        isValid = false;
    } else if (isNaN(Number(form.target))) {
        errors.target = "Target must be a valid number";
        isValid = false;
    } else if (Number(form.target) < 0) {
        errors.target = "Target cannot be negative";
        isValid = false;
    }

    // 'Current' is optional; if provided, it must be a valid, non-negative number
    if (form.current) {
        if (isNaN(Number(form.current))) {
            errors.current = "Current progress must be a valid number";
            isValid = false;
        } else if (Number(form.current) < 0) {
            errors.current = "Current progress cannot be negative";
            isValid = false;
        } else if (Number(form.current) > Number(form.target)) {
            errors.current = "Current progress cannot exceed the target";
            isValid = false;
        }
    }

    if (!form.targetDate.trim()) {
        errors.targetDate = "Target date is required";
        isValid = false;
    } else {
        const parsedDate = Date.parse(form.targetDate);
        if (isNaN(parsedDate)) {
            errors.targetDate = "Target date must be a valid date";
            isValid = false;
        }
    }

    return { isValid, errors };
};
