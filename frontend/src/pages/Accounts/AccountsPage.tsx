import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NoAccounts from "@/components/accounts/NoAccounts";
import AccountsDataExists from "@/components/accounts/AccountsDataExists";
import { fetchAccounts, createAccount, updateAccount, deleteAccount } from "@/api/accounts";
import { getUserId } from "@/lib/utils";
import type { Account } from "@/types/accounts.types";

export const AccountsPage = () => {
    const queryClient = useQueryClient();

    const {
        data: accounts = [],
        isLoading,
        isError,
        error,
    } = useQuery<Account[], Error>({ queryKey: ["accounts", getUserId()], queryFn: fetchAccounts });

    // Mutation for adding an account
    const createAccountMutation = useMutation({
        mutationFn: async (newAccount: Omit<Account, "id">) => {
            createAccount(newAccount);
        },
        onSuccess: () => {
            // Invalidate accounts query to refetch data
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
    });

    // Mutation for updating an account
    const updateAccountMutation = useMutation({
        mutationFn: async (updatedAccount: Account) => {
            updateAccount(updatedAccount);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
    });

    // Mutation for deleting an account
    const deleteAccountMutation = useMutation({
        mutationFn: async (accountId: string) => {
            deleteAccount(accountId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
    });

    /*
     * Sets the title of the page to "Accounts | Wallet" when the component mounts
     */
    useEffect(() => {
        document.title = "Accounts | Wallet";
    }, []);

    // Loading state
    if (isLoading) {
        return <div className='flex justify-center font-primary items-center h-64'>Loading accounts...</div>;
    }

    // Error state
    if (isError) {
        return (
            <div className='w-6/12 mx-auto p-4 mt-10 bg-red-100 text-red-600 font-primary text-center rounded-md'>
                Error fetching accounts: {error.message}
            </div>
        );
    }

    return accounts.length > 0 ? (
        <AccountsDataExists
            accounts={accounts}
            createAccountMutation={createAccountMutation}
            updateAccountMutation={updateAccountMutation}
            deleteAccountMutation={deleteAccountMutation}
        />
    ) : (
        <NoAccounts
            accounts={accounts}
            createAccountMutation={createAccountMutation}
        />
    );
};

export default AccountsPage;
