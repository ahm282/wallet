import { getContextApi } from "@/lib/api_adapter";
import { getUserId } from "@/lib/utils";
import type { Bill } from "@/types/bills.types";

export const fetchBills = async (): Promise<Bill[]> => {
    const userId = getUserId();
    const api = getContextApi();
    return await api.get<Bill[]>(`/finance/bill?id=${userId}`);
};

export const createBill = async (newBill: Omit<Bill, "id">) => {
    const api = getContextApi();
    return await api.post("/finance/bill", {
        ...newBill,
        userId: getUserId(),
    });
};

export const updateBill = async (updatedBill: Bill) => {
    const api = getContextApi();
    return await api.patch(`/finance/bill?id=${updatedBill.id}`, updatedBill);
};

export const deleteBill = async (billId: string) => {
    const api = getContextApi();
    return await api.delete(`/finance/bill?id=${billId}`);
};

export const payBill = async (billId: string) => {
    const api = getContextApi();
    return await api.patch(`/finance/bill/pay?id=${billId}`, {});
};
