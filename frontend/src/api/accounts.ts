import { instantiateAPI } from "@/lib/api_utils";
import { getUserId } from "@/lib/utils";
import type { Account } from "@/types/accounts.types";

export const fetchAccounts = async (): Promise<Account[]> => {
    const userId = getUserId();
    const api = instantiateAPI("http://localhost:3000/api");
    return await api.get<Account[]>(`/finance/account?id=${userId}`);
};

export const createAccount = async (newAccount: Omit<Account, "id">) => {
    const api = instantiateAPI("http://localhost:3000/api");
    return await api.post("/finance/account", {
        ...newAccount,
        userId: getUserId(),
    });
};

export const updateAccount = async (updatedAccount: Account) => {
    const api = instantiateAPI("http://localhost:3000/api");
    return await api.patch(`/finance/account?id=${updatedAccount.id}`, updatedAccount);
};

export const deleteAccount = async (accountId: string) => {
    const api = instantiateAPI("http://localhost:3000/api");
    return await api.delete(`/finance/account?id=${accountId}`);
};
