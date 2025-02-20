// Accounts definitions
export interface Account {
    id: number;
    name: string;
    institution: string;
    balance: number;
    currency: string;
}

export interface NoAccountsProps {
    accounts: Account[];
    setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
}

export interface AccountsDataExistsProps {
    accounts: Account[];
    setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
}

export interface AddAccountDialogProps {
    accounts: Account[];
    setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
    children?: React.ReactNode;
}

export interface EditAccountDialogProps {
    account: Account | null;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSave: (account: Account) => void;
}

export type AccountForm = Omit<Account, "id">;

export interface AccountFormErrors {
    name: string;
    institution: string;
    balance: string;
    currency: string;
}

export interface EditedAccountForm extends AccountForm {
    id: number;
}
