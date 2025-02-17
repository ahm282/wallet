import { useState, useEffect } from "react";
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
import type { Transaction, EditTransactionDialogProps } from "@/types/transactions.types";
import { Category } from "@/types/transactions.types";

export const EditTransactionDialog: React.FC<EditTransactionDialogProps> = ({
    isOpen,
    setIsOpen,
    transaction,
    onSave,
}) => {
    const [editedTransaction, setEditedTransaction] = useState<Transaction | null>(transaction);

    useEffect(() => {
        setEditedTransaction(transaction);
    }, [transaction]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editedTransaction) {
            onSave(editedTransaction);
            setIsOpen(false);
        }
    };

    if (!editedTransaction) return null;

    return (
        <Credenza
            open={isOpen}
            onOpenChange={setIsOpen}>
            <CredenzaContent className='sm:max-w-[425px]'>
                <CredenzaHeader>
                    <CredenzaTitle>Edit Transaction</CredenzaTitle>
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
                            <Input
                                id='edit-description'
                                value={editedTransaction.description}
                                onChange={(e) =>
                                    setEditedTransaction({
                                        ...editedTransaction,
                                        description: e.target.value,
                                    })
                                }
                                className='col-span-3'
                            />
                        </div>
                        {/* Date Field */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='edit-date'
                                className='text-right'>
                                Date
                            </Label>
                            <DatePicker
                                date={editedTransaction.date}
                                onSelect={(selectedDate) =>
                                    setEditedTransaction({ ...editedTransaction, date: selectedDate })
                                }
                                className='col-span-3'
                            />
                        </div>
                        {/* Amount Field */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='edit-amount'
                                className='text-right'>
                                Amount
                            </Label>
                            <Input
                                id='edit-amount'
                                type='number'
                                step='0.01'
                                value={editedTransaction.amount}
                                onChange={(e) =>
                                    setEditedTransaction({
                                        ...editedTransaction,
                                        amount: Number(e.target.value),
                                    })
                                }
                                className='col-span-3'
                            />
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
                                    onValueChange={(value) =>
                                        setEditedTransaction({
                                            ...editedTransaction,
                                            category: value as Category,
                                        })
                                    }
                                />
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
