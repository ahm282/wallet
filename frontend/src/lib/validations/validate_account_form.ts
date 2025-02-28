import { AccountForm, AccountFormErrors } from "@/types/accounts.types";

const validateAccountForm = (newAccount: AccountForm): { isValid: boolean; errors: AccountFormErrors } => {
    let isValid = true;
    let errorsObj: AccountFormErrors = {
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

    // if (!newAccount.currency.trim()) {
    //     errorsObj.currency = "Currency is required";
    //     isValid = false;
    // }

    return { isValid, errors: errorsObj };
};

export default validateAccountForm;
