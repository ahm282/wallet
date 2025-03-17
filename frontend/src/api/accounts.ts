import { instantiateAPI } from "@/lib/api_utils";
import { getUserId } from "@/lib/utils";
import type { Account } from "@/types/accounts.types";

export const fetchAccounts = async (): Promise<Account[]> => {
    const userId = getUserId();
    const api = instantiateAPI();
    return await api.get<Account[]>(`/finance/account?id=${userId}`);
};

export const createAccount = async (newAccount: Omit<Account, "id">) => {
    const api = instantiateAPI();
    return await api.post("/finance/account", {
        ...newAccount,
        userId: getUserId(),
    });
};

export const updateAccount = async (updatedAccount: Account) => {
    const api = instantiateAPI();
    return await api.patch(`/finance/account?id=${updatedAccount.id}`, updatedAccount);
};

export const deleteAccount = async (accountId: string) => {
    const api = instantiateAPI();
    return await api.delete(`/finance/account?id=${accountId}`);
};
