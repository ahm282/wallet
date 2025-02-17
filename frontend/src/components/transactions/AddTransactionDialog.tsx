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
import { PlusCircle } from "lucide-react";
import { CategorySelect } from "@/components/transactions/CategoriesDropdown";
import { DatePicker } from "@/components/ui/date-picker";
import { type AddTransactionDialogProps, Category } from "@/types/transactions.types";

export const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({
    isOpen,
    setIsOpen,
    onAdd,
    newTransaction,
    setNewTransaction,
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Only add if all required fields are provided
        if (newTransaction.date && newTransaction.description && newTransaction.amount && newTransaction.category) {
            onAdd(newTransaction);
            setNewTransaction({
                date: undefined,
                description: "",
                amount: 0,
                category: Category.Other,
            });
            setIsOpen(false);
        }
    };

    return (
        <Credenza
            open={isOpen}
            onOpenChange={setIsOpen}>
            <CredenzaContent className='sm:max-w-[425px]'>
                <CredenzaHeader>
                    <CredenzaTitle>Add New Transaction</CredenzaTitle>
                    <CredenzaDescription>Enter the details of your new transaction.</CredenzaDescription>
                </CredenzaHeader>
                <form onSubmit={handleSubmit}>
                    <div className='grid gap-4 py-6 w-10/12 mx-auto'>
                        {/* Date Field */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='date'
                                className='text-right'>
                                Date
                            </Label>
                            <div className='col-span-3'>
                                <DatePicker
                                    date={newTransaction.date}
                                    onSelect={(selectedDate) =>
                                        setNewTransaction({
                                            ...newTransaction,
                                            date: selectedDate,
                                        })
                                    }
                                    className='col-span-3'
                                />
                            </div>
                        </div>
                        {/* Description Field */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='description'
                                className='text-right'>
                                Description
                            </Label>
                            <Input
                                id='description'
                                value={newTransaction.description}
                                onChange={(e) =>
                                    setNewTransaction({
                                        ...newTransaction,
                                        description: e.target.value,
                                    })
                                }
                                className='col-span-3'
                            />
                        </div>
                        {/* Amount Field */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='amount'
                                className='text-right'>
                                Amount
                            </Label>
                            <Input
                                id='amount'
                                type='number'
                                step='0.01'
                                value={newTransaction.amount}
                                onChange={(e) =>
                                    setNewTransaction({
                                        ...newTransaction,
                                        amount: Number(e.target.value),
                                    })
                                }
                                className='col-span-3'
                            />
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
                                    onValueChange={(value) =>
                                        setNewTransaction({
                                            ...newTransaction,
                                            category: value as Category,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <CredenzaFooter className='w-11/12 mx-auto'>
                        <Button type='submit'>
                            <PlusCircle className='mr-2 size-4' /> Add Transaction
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
