import { instantiateAPI } from "@/lib/api_utils";
import { getUserId } from "@/lib/utils";
import type { Bill } from "@/types/bills.types";

export const fetchBills = async (): Promise<Bill[]> => {
    const userId = getUserId();
    const api = instantiateAPI();
    return await api.get<Bill[]>(`/bill?id=${userId}`);
};

export const createBill = async (newBill: Omit<Bill, "id">) => {
    const api = instantiateAPI();
    return await api.post("/bill", {
        ...newBill,
        userId: getUserId(),
    });
};

export const updateBill = async (updatedBill: Bill) => {
    const api = instantiateAPI();
    return await api.patch(`/bill?id=${updatedBill.id}`, updatedBill);
};

export const deleteBill = async (billId: string) => {
    const api = instantiateAPI();
    return await api.delete(`/bill?id=${billId}`);
};

export const payBill = async (billId: string) => {
    const api = instantiateAPI();
    return await api.patch(`/bill/pay?id=${billId}`);
};
