import type { Bill, BillFormErrors } from "@/types/bills.types";

const validateBillForm = (
  newBill: Bill,
): { isValid: boolean; errors: BillFormErrors } => {
  let isValid = true;
  let errorsObj: BillFormErrors = {
    payee: "",
    amount: "",
    dueDate: "",
    paidOn: "",
  };

  if (!newBill.payee.trim()) {
    errorsObj.payee = "Payee is required";
    isValid = false;
  }

  if (newBill.amount === undefined || newBill.amount === null) {
    errorsObj.amount = "Amount is required";
    isValid = false;
  } else if (isNaN(Number(newBill.amount)) || newBill.amount <= 0) {
    errorsObj.amount = "Amount must be a valid number greater than 0";
    isValid = false;
  }

  if (!newBill.dueDate.trim()) {
    errorsObj.dueDate = "Due date is required";
    isValid = false;
  }

  if (newBill.paidOn && !newBill.paidOn.trim()) {
    errorsObj.paidOn = "Paid on date is required";
    isValid = false;
  }

  return { isValid, errors: errorsObj };
};

export default validateBillForm;
