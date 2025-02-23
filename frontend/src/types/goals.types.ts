// Goals definitions
export interface Goal {
    _id: string;
    name: string;
    target: number;
    current: number;
    status?: boolean | null;
    targetDate: string | number;
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
    goal: Goal;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSave: (goal: Goal) => void;
}

export interface GoalForm {
    name: string;
    target: string;
    current: string;
    targetDate: string | number;
}

export interface EditedGoalForm extends GoalForm {
    _id: string;
}

export interface GoalFormErrors {
    name: string;
    target: string;
    current: string;
    targetDate: string;
}

// Define backend's user response.
export interface GoalResponse {
    _id: string;
    name: string;
    totalAmount: number;
    currentAmount: number;
    status: string;
    targetDate: string;
    userId: string;
}
