import React, { useState, useEffect } from "react";
import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategorySelect } from "@/components/transactions/CategoriesDropdown";
import { DatePicker } from "@/components/ui/date-picker";
import { validateTransactionForm } from "@/lib/validations/validate_transaction_form";
import type {
  EditTransactionDialogProps,
  TransactionFormErrors,
  Category,
  Transaction,
} from "@/types/transactions.types";

export const EditTransactionDialog: React.FC<EditTransactionDialogProps> = ({
  isOpen,
  setIsOpen,
  transaction,
  onSave,
}) => {
  // Explicitly type the state as Transaction | null.
  const [editedTransaction, setEditedTransaction] =
    useState<Transaction | null>(transaction);
  const [errors, setErrors] = useState<TransactionFormErrors>({});

  // Update state and clear errors when transaction changes.
  useEffect(() => {
    setEditedTransaction(transaction);
    setErrors({});
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTransaction) {
      const { isValid, errors } = validateTransactionForm(editedTransaction);
      if (isValid) {
        onSave(editedTransaction);
        setIsOpen(false);
      } else {
        setErrors(errors);
      }
    }
  };

  // Make the function generic over keys of Transaction.
  const handleFieldChange = <K extends keyof TransactionFormErrors>(
    field: K,
    value: Transaction[K],
  ) => {
    if (!editedTransaction) return;
    setEditedTransaction({
      ...editedTransaction,
      [field]: value,
    });
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: undefined,
      });
    }
  };

  if (!editedTransaction) return null;

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaContent className="sm:max-w-[425px]">
        <CredenzaHeader>
          <CredenzaTitle>Edit Transaction</CredenzaTitle>
          <CredenzaDescription>
            Update your transaction details.
          </CredenzaDescription>
        </CredenzaHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-6 w-10/12 mx-auto">
            {/* Description Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-description"
                  value={editedTransaction.description}
                  onChange={(e) =>
                    handleFieldChange("description", e.target.value)
                  }
                  className="col-span-3"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs">{errors.description}</p>
                )}
              </div>
            </div>
            {/* Date Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <DatePicker
                  date={editedTransaction.date}
                  onSelect={(selectedDate) =>
                    handleFieldChange("date", selectedDate)
                  }
                  className="col-span-3"
                />
                {errors.date && (
                  <p className="text-red-500 text-xs">{errors.date}</p>
                )}
              </div>
            </div>
            {/* Amount Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-amount" className="text-right">
                Amount
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  value={editedTransaction.amount}
                  onChange={(e) =>
                    handleFieldChange("amount", Number(e.target.value))
                  }
                  className="col-span-3"
                />
                {errors.amount && (
                  <p className="text-red-500 text-xs">{errors.amount}</p>
                )}
              </div>
            </div>
            {/* Category Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                Category
              </Label>
              <div className="col-span-3">
                <CategorySelect
                  value={editedTransaction.category}
                  isFormSelect={true}
                  onValueChange={(value) =>
                    handleFieldChange("category", value as Category)
                  }
                />
                {errors.category && (
                  <p className="text-red-500 text-xs">{errors.category}</p>
                )}
              </div>
            </div>
          </div>
          <CredenzaFooter className="w-11/12 mx-auto">
            <Button type="submit">Update Transaction</Button>
            <CredenzaClose asChild>
              <Button variant="outline">Cancel</Button>
            </CredenzaClose>
          </CredenzaFooter>
        </form>
      </CredenzaContent>
    </Credenza>
  );
};

export default EditTransactionDialog;
