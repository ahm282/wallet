import type {
  TransactionForm,
  TransactionFormErrors,
} from "@/types/transactions.types";

export const validateTransactionForm = (
  form: TransactionForm,
): { isValid: boolean; errors: TransactionFormErrors } => {
  let isValid = true;
  const errors: TransactionFormErrors = {};

  if (!form.date) {
    errors.date = "Date is required";
    isValid = false;
  }
  if (!form.description.trim()) {
    errors.description = "Description is required";
    isValid = false;
  }
  if (form.amount === undefined || isNaN(form.amount)) {
    errors.amount = "Amount must be a valid number";
    isValid = false;
  } else if (form.amount === 0) {
    errors.amount = "Amount cannot be zero";
    isValid = false;
  }
  if (form.category === null) {
    errors.category = "Category is required";
    isValid = false;
  }

  return { isValid, errors };
};
