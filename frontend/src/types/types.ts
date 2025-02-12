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
