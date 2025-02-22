// Budget definitions
export interface Budget {
    id?: string | number;
    name: string;
    budgeted: number;
    spent: number;
}

export interface NoBudgetProps {
    budgets: Budget[];
    setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
}

export interface BudgetDataExistsProps {
    budgets: Budget[];
    setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
}

export interface AddBudgetDialogProps {
    budgets: Budget[];
    setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
    children?: React.ReactNode;
}

export interface DeleteWarningProps {
    icon: React.ComponentType<{ className?: string }>;
    message: string;
    children: React.ReactNode;
    onConfirm?: () => void;
    onCancel?: () => void;
}

export interface EditBudgetDialogProps {
    budget: Budget | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onSave: (budget: Budget) => void;
}

export interface EditedBudgetForm {
    id: string | number | undefined;
    name: string;
    budgeted: string;
    spent: string;
}

export interface BudgetFormErrors {
    name: string;
    budgeted: string;
    spent: string;
}

export interface NewBudget {
    name: string;
    budgeted: string;
    spent: string;
}
