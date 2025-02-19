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
import { Plus } from "lucide-react";
import { useState } from "react";
import type { AddBudgetDialogProps } from "@/types/budget.types";

export const AddBudgetDialog: React.FC<AddBudgetDialogProps> = ({ budgets, setBudgets }) => {
    const [newBudget, setNewBudget] = useState({
        name: "",
        budgeted: "",
        spent: "",
    });
    const [errors, setErrors] = useState({
        name: "",
        budgeted: "",
        spent: "",
    });
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Validate the form fields
    const validateForm = () => {
        let isValid = true;
        let errorsObj = { name: "", budgeted: "", spent: "" };

        if (!newBudget.name.trim()) {
            errorsObj.name = "Name is required";
            isValid = false;
        }

        if (!newBudget.budgeted) {
            errorsObj.budgeted = "Budget is required";
            isValid = false;
        } else if (isNaN(Number(newBudget.budgeted))) {
            errorsObj.budgeted = "Budget must be a valid number";
            isValid = false;
        }

        if (newBudget.spent && isNaN(Number(newBudget.spent))) {
            errorsObj.spent = "Spent must be a valid number";
            isValid = false;
        }

        // Non-negative values check
        if (newBudget.budgeted && Number(newBudget.budgeted) < 0) {
            errorsObj.budgeted = "Budget cannot be negative";
            isValid = false;
        }

        if (Number(newBudget.spent) > Number(newBudget.budgeted)) {
            errorsObj.spent = "Spent cannot be greater than budgeted";
            isValid = false;
        }

        if (newBudget.spent && Number(newBudget.spent) < 0) {
            errorsObj.spent = "Spent cannot be negative";
            isValid = false;
        }

        setErrors(errorsObj);
        return isValid;
    };

    const handleAddBudget = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            setBudgets([
                ...budgets,
                {
                    id: budgets.length + 1,
                    ...newBudget,
                    budgeted: Number.parseFloat(newBudget.budgeted),
                    spent: Number.parseFloat(newBudget.spent) || 0,
                },
            ]);
            // Reset the form and errors
            setNewBudget({ name: "", budgeted: "", spent: "" });
            setErrors({ name: "", budgeted: "", spent: "" });
            setIsAddDialogOpen(false);
        }
    };

    return (
        <>
            <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className='mr-2 size-4' /> Add Budget
            </Button>
            <Credenza
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}>
                <CredenzaContent className='sm:max-w-[425px]'>
                    <CredenzaHeader>
                        <CredenzaTitle>Add New Budget</CredenzaTitle>
                        <CredenzaDescription>Create a new budget category to track your spending</CredenzaDescription>
                    </CredenzaHeader>
                    <form onSubmit={handleAddBudget}>
                        <div className='w-11/12 grid gap-4 py-4'>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label
                                    htmlFor='name'
                                    className='text-right'>
                                    Name
                                </Label>
                                <div className='col-span-3'>
                                    <Input
                                        id='name'
                                        value={newBudget.name}
                                        onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })}
                                    />
                                    {errors.name && <p className='text-xs text-red-500'>{errors.name}</p>}
                                </div>
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label
                                    htmlFor='budgeted'
                                    className='text-right'>
                                    Budget
                                </Label>
                                <div className='col-span-3'>
                                    <Input
                                        id='budgeted'
                                        type='text'
                                        value={newBudget.budgeted}
                                        onChange={(e) => setNewBudget({ ...newBudget, budgeted: e.target.value })}
                                    />
                                    {errors.budgeted && <p className='text-xs text-red-500'>{errors.budgeted}</p>}
                                </div>
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label
                                    htmlFor='spent'
                                    className='text-right'>
                                    Spent
                                </Label>
                                <div className='col-span-3'>
                                    <Input
                                        id='spent'
                                        type='text'
                                        value={newBudget.spent}
                                        onChange={(e) => setNewBudget({ ...newBudget, spent: e.target.value })}
                                    />
                                    {errors.spent && <p className='text-xs text-red-500'>{errors.spent}</p>}
                                </div>
                            </div>
                        </div>
                        <CredenzaFooter className='w-11/12 mx-auto'>
                            <Button type='submit'>
                                <Plus className='mr-2 h-4 w-4' /> Add Budget
                            </Button>
                            <CredenzaClose asChild>
                                <Button variant='outline'>Cancel</Button>
                            </CredenzaClose>
                        </CredenzaFooter>
                    </form>
                </CredenzaContent>
            </Credenza>
        </>
    );
};
