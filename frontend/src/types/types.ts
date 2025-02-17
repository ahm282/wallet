// Budget definitions
export interface Budget {
    id: number;
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

// Goals definitions
export interface Goal {
    id: number;
    name: string;
    target: number;
    current: number;
    targetDate: string;
}

export interface NoGoalsProps {
    goals: Goal[];
    setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

export interface GoalsDataExistsProps {
    goals: Goal[];
    setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

export interface AddGoalDialogProps {
    goals: Goal[];
    setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
    children?: React.ReactNode;
}

export interface EditGoalDialogProps {
    goal: Goal | null;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSave: (goal: Goal) => void;
}

export interface EditedGoalForm extends GoalForm {
    id: number;
}

export interface GoalForm {
    name: string;
    target: string;
    current: string;
    targetDate: string;
}

export interface GoalFormErrors {
    name: string;
    target: string;
    current: string;
    targetDate: string;
}
