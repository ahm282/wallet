import { UseMutationResult } from "@tanstack/react-query";

// Budget definitions
export interface Budget {
    id: string;
    name: string;
    budgeted: number | string | null;
    spent: number | string | null;
}

export interface NoBudgetProps {
    budgets: Budget[];
    createBudgetMutation?: UseMutationResult<any, Error, Omit<Budget, "id">, unknown>;
}

export interface BudgetDataExistsProps {
    budgets: Budget[];
    createBudgetMutation?: UseMutationResult<any, Error, Omit<Budget, "id">, unknown>;
    updateBudgetMutation?: UseMutationResult<any, Error, Budget>;
    deleteBudgetMutation?: UseMutationResult<any, Error, string>;
}

export interface AddBudgetDialogProps {
    budgets: Budget[];
    createBudgetMutation?: UseMutationResult<any, Error, Omit<Budget, "id">>;
}

export interface EditBudgetDialogProps {
    budget: Budget | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onSave: (budget: Budget) => void;
}

export type BudgetForm = Omit<Budget, "id">;

export interface EditedBudgetForm extends BudgetForm {
    id: string;
}

export interface BudgetFormErrors {
    name: string;
    budgeted: string;
    spent: string;
}

// export interface DeleteWarningProps {
//     icon: React.ComponentType<{ className?: string }>;
//     message: string;
//     children: React.ReactNode;
//     onConfirm?: () => void;
//     onCancel?: () => void;
// }
