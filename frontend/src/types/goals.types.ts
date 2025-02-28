import { UseMutationResult } from "@tanstack/react-query";

// Goals definitions
export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    status?: boolean | null;
    targetDate: string | number;
}

export interface NoGoalsProps {
    goals: Goal[];
    createGoalMutation?: UseMutationResult<any, Error, Omit<Goal, "id">>;
}

export interface GoalsDataExistsProps {
    goals: Goal[];
    createGoalMutation?: UseMutationResult<any, Error, Omit<Goal, "id">, unknown>;
    updateGoalMutation?: UseMutationResult<any, Error, Goal>;
    deleteGoalMutation?: UseMutationResult<any, Error, string>;
}

export interface AddGoalDialogProps {
    createGoalMutation?: UseMutationResult<any, Error, Omit<Goal, "id">>;
}

export interface EditGoalDialogProps {
    goal: Goal;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSave: (goal: Goal) => void;
}

export interface GoalForm {
    name: string;
    targetAmount: string;
    currentAmount: string;
    targetDate: string | number;
}

export interface EditedGoalForm extends GoalForm {
    id: string;
}

export interface GoalFormErrors {
    name: string;
    targetAmount: string;
    currentAmount: string;
    targetDate: string;
}

// Define backend's user response.
export interface GoalResponse {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    status: string;
    targetDate: string;
    userId: string;
}
