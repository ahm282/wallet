// Bills definitions
export interface Bill {
    id: number;
    payee: string;
    amount: number;
    dueDate: string;
    paidOn?: string | null;
    paid: boolean;
    description: string;
}

export interface NoBillsProps {
    bills: Bill[];
    setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
}

export interface BillsDataExistsProps {
    bills: Bill[];
    setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
}

export interface AddBillDialogProps {
    bills: Bill[];
    setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
    children?: React.ReactNode;
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
