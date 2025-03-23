import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NoBills } from "@/components/bills/NoBills";
import { BillsDataExists } from "@/components/bills/BillsDataExists";
import { fetchBills, createBill, updateBill, deleteBill, payBill } from "@/api/bills";
import { getUserId } from "@/lib/utils";
import type { Bill } from "@/types/bills.types";

export const BillsPage = () => {
    const queryClient = useQueryClient();

    const {
        data: bills = [],
        isLoading,
        isError,
        error,
    } = useQuery<Bill[], Error>({ queryKey: ["bills", getUserId()], queryFn: fetchBills });

    // Mutation for adding a bill
    const createBillMutation = useMutation({
        mutationFn: async (newBill: Omit<Bill, "id">) => {
            return createBill(newBill);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bills", getUserId()] });
        },
    });

    // Mutation for updating a bill
    const updateBillMutation = useMutation({
        mutationFn: async (updatedBill: Bill) => {
            return updateBill(updatedBill);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bills", getUserId()] });
        },
    });

    // Mutation for deleting a bill
    const deleteBillMutation = useMutation({
        mutationFn: async (billId: string) => {
            return deleteBill(billId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bills", getUserId()] });
        },
    });

    // Mutation for marking a bill as paid
    const markBillAsPaidMutation = useMutation({
        mutationFn: async (billId: string) => {
            return payBill(billId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bills", getUserId()] });
        },
    });

    /*
     * Sets the title of the page to "Bills | Wallet" when the component mounts
     */
    useEffect(() => {
        document.title = "Bills | Wallet";
    }, []);

    // Loading state
    if (isLoading) {
        return <div className='flex justify-center items-center font-primary text-center h-64'>Loading bills...</div>;
    }

    // Error state
    if (isError) {
        return (
            <div className='w-6/12 mx-auto p-4 mt-10 bg-red-100 text-red-600 font-primary text-center rounded-md'>
                Error fetching bills: {error.message}
            </div>
        );
    }

    return bills.length > 0 ? (
        <BillsDataExists
            bills={bills}
            createBillMutation={createBillMutation}
            updateBillMutation={updateBillMutation}
            deleteBillMutation={deleteBillMutation}
            markBillAsPaidMutation={markBillAsPaidMutation}
        />
    ) : (
        <NoBills
            bills={bills}
            createBillMutation={createBillMutation}
        />
    );
};

export default BillsPage;
