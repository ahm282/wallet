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

export interface EditedGoalForm extends GoalForm {
    id: number;
}
