import { UseMutationResult } from "@tanstack/react-query";

// Accounts definitions
export interface Account {
    id: string;
    name: string;
    institution: string;
    balance: number | string | null;
    currency: string;
}

export interface NoAccountsProps {
    accounts: Account[];
    createAccountMutation?: UseMutationResult<any, Error, Omit<Account, "id">, unknown>;
}

export interface AccountsDataExistsProps {
    accounts: Account[];
    createAccountMutation?: UseMutationResult<any, Error, Omit<Account, "id">, unknown>;
    updateAccountMutation?: UseMutationResult<any, Error, Account>;
    deleteAccountMutation?: UseMutationResult<any, Error, string>;
}

export type EditAccountFormLocal = Omit<Account, "balance"> & {
    balance: string;
};

export interface AddAccountDialogProps {
    createAccountMutation?: UseMutationResult<any, Error, Omit<Account, "id">>;
}

export interface EditAccountDialogProps {
    account: Account | null;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSave: (account: Account) => void;
}

export type AccountForm = Omit<Account, "id">;

export interface EditedAccountForm extends AccountForm {
    id: number;
}

export interface AccountFormErrors {
    name: string;
    institution: string;
    balance: string;
    currency: string;
}

export interface AccountsTableProps {
    accounts: Account[];
    handleEdit: (account: Account) => void;
    handleDelete: (id: string) => void;
}
