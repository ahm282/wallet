import { useApi } from "@/providers/ApiProvider";
import { getUserId } from "@/lib/utils";
import type { Bill } from "@/types/bills.types";

export const useBills = () => {
    const api = useApi();

    const fetchBills = async (): Promise<Bill[]> => {
        const userId = getUserId();
        return await api.get<Bill[]>(`/finance/bill?id=${userId}`);
    };

    const createBill = async (newBill: Omit<Bill, "id">) => {
        return await api.post("/finance/bill", {
            ...newBill,
            userId: getUserId(),
        });
    };

    const updateBill = async (updatedBill: Bill) => {
        return await api.patch(`/finance/bill?id=${updatedBill.id}`, updatedBill);
    };

    const deleteBill = async (billId: string) => {
        return await api.delete(`/finance/bill?id=${billId}`);
    };

    const payBill = async (billId: string) => {
        return await api.patch(`/finance/bill/pay?id=${billId}`);
    };

    return { fetchBills, createBill, updateBill, deleteBill, payBill };
};
