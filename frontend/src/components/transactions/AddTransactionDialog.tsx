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
import { List, PlusCircle } from "lucide-react";
import { validateTransactionForm } from "@/lib/validations/validate_transaction_form";
import type { AddTransactionDialogProps, TransactionFormErrors, Category } from "@/types/transactions.types";

export const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({
    isOpen,
    setIsOpen,
    onAdd,
    newTransaction,
    setNewTransaction,
}) => {
    const [errors, setErrors] = useState<TransactionFormErrors>({});

    // Reset form and errors when the dialog is closed.
    useEffect(() => {
        if (!isOpen) {
            setErrors({});
            setNewTransaction({
                date: undefined,
                description: "",
                amount: 0,
                category: null,
            });
        }
    }, [isOpen, setNewTransaction]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { isValid, errors } = validateTransactionForm(newTransaction);

        if (isValid) {
            onAdd(newTransaction);
            // Clear form and errors after adding.
            setNewTransaction({
                date: undefined,
                description: "",
                amount: 0,
                category: null,
            });
            setErrors({});
            setIsOpen(false);
        } else {
            setErrors(errors);
        }
    };

    // Helper to update a field and clear its error if any.
    const handleFieldChange = (field: keyof typeof newTransaction, value: any) => {
        setNewTransaction({
            ...newTransaction,
            [field]: value,
        });
        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: undefined,
            });
        }
    };

    return (
        <Credenza
            open={isOpen}
            onOpenChange={setIsOpen}>
            <CredenzaContent className='sm:max-w-[425px]'>
                <CredenzaHeader>
                    <CredenzaTitle className='flex items-center justify-center md:justify-start'>
                        <List className='size-5 me-2' />
                        Add New Transaction
                    </CredenzaTitle>
                    <CredenzaDescription>Enter the details of your new transaction.</CredenzaDescription>
                </CredenzaHeader>
                <form onSubmit={handleSubmit}>
                    <div className='grid gap-4 py-6 w-10/12 mx-auto'>
                        {/* Description Field */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='description'
                                className='text-right'>
                                Description
                            </Label>
                            <div className='col-span-3'>
                                <Input
                                    id='description'
                                    value={newTransaction.description}
                                    onChange={(e) => handleFieldChange("description", e.target.value)}
                                    className='col-span-3'
                                />
                                {errors.description && <p className='text-red-500 text-xs'>{errors.description}</p>}
                            </div>
                        </div>
                        {/* Date Field */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='date'
                                className='text-right'>
                                Date
                            </Label>
                            <div className='col-span-3'>
                                <DatePicker
                                    date={newTransaction.date ? new Date(newTransaction.date) : undefined}
                                    onSelect={(selectedDate) => handleFieldChange("date", selectedDate?.getTime())}
                                    className='col-span-3'
                                />
                                {errors.date && <p className='text-red-500 text-xs'>{errors.date}</p>}
                            </div>
                        </div>
                        {/* Amount Field */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='amount'
                                className='text-right'>
                                Amount
                            </Label>
                            <div className='col-span-3'>
                                <Input
                                    id='amount'
                                    type='number'
                                    step='0.01'
                                    value={newTransaction.amount}
                                    onChange={(e) => handleFieldChange("amount", Number(e.target.value))}
                                    className='col-span-3'
                                />
                                {errors.amount && <p className='text-red-500 text-xs'>{errors.amount}</p>}
                            </div>
                        </div>
                        {/* Category Field */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='category'
                                className='text-right'>
                                Category
                            </Label>
                            <div className='col-span-3'>
                                <CategorySelect
                                    value={newTransaction.category}
                                    isFormSelect={true}
                                    onValueChange={(value) => handleFieldChange("category", value as Category)}
                                />
                                {errors.category && <p className='text-red-500 text-xs'>{errors.category}</p>}
                            </div>
                        </div>
                    </div>
                    <CredenzaFooter className='w-11/12 mx-auto'>
                        <Button type='submit'>
                            <PlusCircle className='mr-2 h-4 w-4' /> Add Transaction
                        </Button>
                        <CredenzaClose asChild>
                            <Button variant='outline'>Cancel</Button>
                        </CredenzaClose>
                    </CredenzaFooter>
                </form>
            </CredenzaContent>
        </Credenza>
    );
};

export default AddTransactionDialog;
