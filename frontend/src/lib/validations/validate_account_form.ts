import { AccountForm, AccountErrors } from "@/types/accounts.types";

const validateAccountForm = (newAccount: AccountForm): { isValid: boolean; errors: AccountErrors } => {
    let isValid = true;
    let errorsObj: AccountErrors = {
        name: "",
        balance: "",
        institution: "",
        currency: "",
    };

    if (!newAccount.name.trim()) {
        errorsObj.name = "Name is required";
        isValid = false;
    }

    if (newAccount.balance === undefined || newAccount.balance === null) {
        errorsObj.balance = "Initial balance is required";
        isValid = false;
    } else if (isNaN(Number(newAccount.balance))) {
        errorsObj.balance = "Balance must be a valid number";
        isValid = false;
    }

    if (!newAccount.institution.trim()) {
        errorsObj.institution = "Institution is required";
        isValid = false;
    }

    if (!newAccount.currency.trim()) {
        errorsObj.currency = "Currency is required";
        isValid = false;
    }

    return { isValid, errors: errorsObj };
};

export default validateAccountForm;
