// Accounts definitions
export interface Account {
    id: string;
    name: string;
    institution: string;
    balance: number;
    currency: string;
}

export interface NoAccountsProps {
    accounts: Account[];
    setAccounts: React.Dispatch<React.SetStateAction<Account[]>> | (() => void);
}

export interface AccountsDataExistsProps {
    accounts: Account[];
    setAccounts: React.Dispatch<React.SetStateAction<Account[]>> | (() => void);
}

export interface AddAccountDialogProps {
    accounts: Account[];
    setAccounts: React.Dispatch<React.SetStateAction<Account[]>> | (() => void);
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

export interface AccountsTableProps {
    accounts: Account[];
    handleEdit: (account: Account) => void;
    handleDelete: (id: string) => void;
}

export interface AccountErrors {
    name: string;
    balance: string;
    institution: string;
    currency: string;
}
