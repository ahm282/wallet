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
import { useMediaQuery } from "@/hooks/use-media-query";
import type {
    EditTransactionDialogProps,
    TransactionFormErrors,
    Category,
    Transaction,
    TransactionFormLocal,
} from "@/types/transactions.types";
import { List } from "lucide-react";

export const EditTransactionDialog: React.FC<EditTransactionDialogProps> = ({
    isOpen,
    setIsOpen,
    transaction,
    onSave,
}) => {
    // Use a local state that stores the transaction as TransactionFormLocal.
    const [editedTransaction, setEditedTransaction] = useState<TransactionFormLocal | null>(null);
    const [errors, setErrors] = useState<TransactionFormErrors>({});
    const isDesktop = useMediaQuery("(min-width: 768px)");

    // When the passed-in transaction changes, initialize local state with amount as a string.
    useEffect(() => {
        if (transaction) {
            setEditedTransaction({
                ...transaction,
                amount: transaction.amount.toString(),
            });
        } else {
            setEditedTransaction(null);
        }
        setErrors({});
    }, [transaction]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editedTransaction) return;

        // Convert the amount from string to number for submission.
        const transactionToSubmit: Transaction = {
            id: transaction!.id, // preserve the original id
            date: editedTransaction.date,
            description: editedTransaction.description,
            amount: Number(editedTransaction.amount),
            category: editedTransaction.category,
        };

        const { isValid, errors } = validateTransactionForm(transactionToSubmit);
        if (isValid) {
            onSave(transactionToSubmit);
            setIsOpen(false);
        } else {
            setErrors(errors);
        }
    };

    // Helper to update fields in the local form state and clear errors for that field.
    const handleFieldChange = (field: keyof TransactionFormLocal, value: any) => {
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
        <Credenza
            open={isOpen}
            onOpenChange={setIsOpen}>
            <CredenzaContent className='sm:max-w-[425px]'>
                <CredenzaHeader>
                    <CredenzaTitle className='flex items-center justify-center md:justify-start'>
                        <List className='size-5 me-2' />
                        Edit Transaction
                    </CredenzaTitle>
                    <CredenzaDescription>Update your transaction details.</CredenzaDescription>
                </CredenzaHeader>
                <form onSubmit={handleSubmit}>
                    <div className='grid gap-4 py-6 w-10/12 mx-auto'>
                        {/* Description Field */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='edit-description'
                                className='text-right'>
                                Description
                            </Label>
                            <div className='col-span-3'>
                                <Input
                                    id='edit-description'
                                    value={editedTransaction.description}
                                    onChange={(e) => handleFieldChange("description", e.target.value)}
                                    className='col-span-3'
                                />
                                {errors.description && <p className='text-red-500 text-xs'>{errors.description}</p>}
                            </div>
                        </div>
                        {/* Date Field */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='edit-date'
                                className='text-right'>
                                Date
                            </Label>
                            <div className='col-span-3'>
                                <DatePicker
                                    date={editedTransaction.date ? new Date(editedTransaction.date) : undefined}
                                    onSelect={(selectedDate) =>
                                        handleFieldChange("date", selectedDate ? selectedDate.getTime() : undefined)
                                    }
                                    className='col-span-3'
                                />
                                {errors.date && <p className='text-red-500 text-xs'>{errors.date}</p>}
                            </div>
                        </div>
                        {/* Amount Field */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='edit-amount'
                                className='text-right'>
                                Amount
                            </Label>
                            <div className='col-span-3'>
                                <Input
                                    id='edit-amount'
                                    type={isDesktop ? "text" : "number"}
                                    value={editedTransaction.amount}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Allow empty value to let user clear the field.
                                        handleFieldChange("amount", value);
                                    }}
                                    className='col-span-3'
                                />
                                {errors.amount && <p className='text-red-500 text-xs'>{errors.amount}</p>}
                            </div>
                        </div>
                        {/* Category Field */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='edit-category'
                                className='text-right'>
                                Category
                            </Label>
                            <div className='col-span-3'>
                                <CategorySelect
                                    value={editedTransaction.category}
                                    isFormSelect={true}
                                    onValueChange={(value) => handleFieldChange("category", value as Category)}
                                />
                                {errors.category && <p className='text-red-500 text-xs'>{errors.category}</p>}
                            </div>
                        </div>
                    </div>
                    <CredenzaFooter className='w-11/12 mx-auto'>
                        <Button type='submit'>Update Transaction</Button>
                        <CredenzaClose asChild>
                            <Button variant='outline'>Cancel</Button>
                        </CredenzaClose>
                    </CredenzaFooter>
                </form>
            </CredenzaContent>
        </Credenza>
    );
};

export default EditTransactionDialog;
