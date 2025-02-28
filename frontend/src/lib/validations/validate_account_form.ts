import { AccountForm, AccountFormErrors } from "@/types/accounts.types";

const validateAccountForm = (newAccount: AccountForm): { isValid: boolean; errors: AccountFormErrors } => {
    let isValid = true;
    const errors: AccountFormErrors = {
        name: "",
        balance: "",
        institution: "",
        currency: "",
    };

    if (!newAccount.name.trim()) {
        errors.name = "Name is required";
        isValid = false;
    }

    if (newAccount.balance === undefined || newAccount.balance === null) {
        errors.balance = "Initial balance is required";
        isValid = false;
    } else if (isNaN(Number(newAccount.balance))) {
        errors.balance = "Balance must be a valid number";
        isValid = false;
    }

    if (!newAccount.institution.trim()) {
        errors.institution = "Institution is required";
        isValid = false;
    }

    return { isValid, errors };
};

export default validateAccountForm;
