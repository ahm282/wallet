import { useApi } from "@/providers/ApiProvider";
import { getUserId } from "@/lib/utils";
import type { Account } from "@/types/accounts.types";

export const useAccounts = () => {
    const api = useApi();

    const fetchAccounts = async (): Promise<Account[]> => {
        const userId = getUserId();
        return await api.get<Account[]>(`/finance/account?id=${userId}`);
    };

    const createAccount = async (newAccount: Omit<Account, "id">) => {
        return await api.post("/finance/account", {
            ...newAccount,
            userId: getUserId(),
        });
    };

    const updateAccount = async (updatedAccount: Account) => {
        return await api.patch(`/finance/account?id=${updatedAccount.id}`, updatedAccount);
    };

    const deleteAccount = async (accountId: string) => {
        return await api.delete(`/finance/account?id=${accountId}`);
    };

    return { fetchAccounts, createAccount, updateAccount, deleteAccount };
};
