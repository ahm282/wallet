import { useState } from "react";
import { NoBills } from "@/components/bills/NoBills";
import BillsDataExists from "@/components/bills/BillsDataExists";
import type { Bill } from "@/types/bills.types";

export const BillsPage = () => {
    // Sample data
    const sampleBills: Bill[] = [
        {
            id: 1,
            payee: "Electricity",
            amount: 100,
            dueDate: "2025-10-25",
            paidOn: "2025-06-10",
            paid: true,
            description: "Monthly electricity bill",
        },
        { id: 2, payee: "Water", amount: 50, dueDate: "2025-08-17", paid: false, description: "Monthly water bill" },
        {
            id: 3,
            payee: "Internet",
            amount: 80,
            dueDate: "2025-12-10",
            paidOn: null,
            paid: false,
            description: "Monthly internet bill",
        },
        {
            id: 4,
            payee: "Phone",
            amount: 30,
            dueDate: "2025-09-10",
            paidOn: "2025-09-01",
            paid: true,
            description: "Monthly phone bill",
        },
    ];

    const [bills, setBills] = useState<Bill[]>(sampleBills);
    const hasBillsData = bills.length > 0;

    return hasBillsData ? (
        <BillsDataExists
            bills={bills}
            setBills={setBills}
        />
    ) : (
        <NoBills
            bills={bills}
            setBills={setBills}
        />
    );
};

export default BillsPage;
