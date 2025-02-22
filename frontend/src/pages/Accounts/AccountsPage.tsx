import { useState, useEffect } from "react";
import type { Account } from "@/types/accounts.types";
import NoAccounts from "@/components/accounts/NoAccounts";
import AccountsDataExists from "@/components/accounts/AccountsDataExists";

export const AccountsPage = () => {
    // Sample data
    const sampleAccounts = [
        {
            id: 1,
            name: "Checking",
            institution: "KBC",
            balance: 1000,
            currency: "EUR",
        },
        {
            id: 2,
            name: "Savings",
            institution: "Argenta",
            balance: 5000,
            currency: "USD",
        },
        {
            id: 3,
            name: "Credit Card",
            institution: "Chase",
            balance: -500,
            currency: "USD",
        },
    ];

    const [accounts, setAccounts] = useState<Account[]>(sampleAccounts);
    const hasAccountData = accounts.length > 0;

    /*
     * Sets the title of the page to "Accounts | Wallet" when the component mounts
     */
    useEffect(() => {
        document.title = "Accounts | Wallet";
    }, []);

    return hasAccountData ? (
        <AccountsDataExists
            accounts={accounts}
            setAccounts={setAccounts}
        />
    ) : (
        <NoAccounts
            accounts={accounts}
            setAccounts={setAccounts}
        />
    );
};

export default AccountsPage;
