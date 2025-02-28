import { UseMutationResult } from "@tanstack/react-query";

// Bills definitions
export interface Bill {
    id: string;
    payee: string;
    description: string;
    amount: number;
    dueDate: string | number | null;
    paidOn?: string | number | null;
    paid: boolean;
}

export interface NoBillsProps {
    bills: Bill[];
    createBillMutation?: UseMutationResult<any, Error, Omit<Bill, "id">, unknown>;
}

export interface BillsDataExistsProps {
    bills: Bill[];
    createBillMutation?: UseMutationResult<any, Error, Omit<Bill, "id">, unknown>;
    updateBillMutation?: UseMutationResult<any, Error, Bill>;
    deleteBillMutation?: UseMutationResult<any, Error, string>;
    markBillAsPaidMutation?: UseMutationResult<any, Error, string>;
}

export interface AddBillDialogProps {
    createBillMutation?: UseMutationResult<any, Error, Omit<Bill, "id">, unknown>;
}

export interface EditBillDialogProps {
    bill: Bill | null;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSave: (bill: Bill) => void;
}

export type BillForm = Omit<Bill, "id"> & { amount: string | number };

export interface BillFormErrors {
    payee: string;
    amount: string;
    dueDate: string;
    paidOn: string;
}

export interface EditedBillForm extends BillForm {
    id: number;
}

export interface BillsDashboardProps {
    bills: Bill[];
}
