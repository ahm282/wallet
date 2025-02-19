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
import { useState, useEffect } from "react";
import type { Budget } from "@/types/budget.types";

interface EditBudgetDialogProps {
    budget: Budget | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onSave: (budget: Budget) => void;
}

interface EditedBudgetForm {
    id: number;
    name: string;
    budgeted: string;
    spent: string;
}

export const EditBudgetDialog: React.FC<EditBudgetDialogProps> = ({ budget, isOpen, setIsOpen, onSave }) => {
    const [editedBudget, setEditedBudget] = useState<EditedBudgetForm | null>(null);
    const [errors, setErrors] = useState({
        name: "",
        budgeted: "",
        spent: "",
    });

    useEffect(() => {
        if (budget) {
            setEditedBudget({
                id: budget.id,
                name: budget.name,
                budgeted: budget.budgeted.toString(),
                spent: budget.spent.toString(),
            });
            // Reset errors whenever a new budget is loaded.
            setErrors({ name: "", budgeted: "", spent: "" });
        }
    }, [budget]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editedBudget) return;

        let isValid = true;
        const newErrors = { name: "", budgeted: "", spent: "" };

        // Validate name
        if (!editedBudget.name.trim()) {
            newErrors.name = "Name is required";
            isValid = false;
        }

        // Validate budgeted
        if (!editedBudget.budgeted.trim()) {
            newErrors.budgeted = "Budget is required";
            isValid = false;
        } else if (isNaN(Number(editedBudget.budgeted))) {
            newErrors.budgeted = "Budget must be a valid number";
            isValid = false;
        } else if (Number(editedBudget.budgeted) < 0) {
            newErrors.budgeted = "Budget cannot be negative";
            isValid = false;
        }

        // Validate spent
        if (!editedBudget.spent.trim()) {
            newErrors.spent = "Spent is required";
            isValid = false;
        } else if (isNaN(Number(editedBudget.spent))) {
            newErrors.spent = "Spent must be a valid number";
            isValid = false;
        } else if (Number(editedBudget.spent) < 0) {
            newErrors.spent = "Spent cannot be negative";
            isValid = false;
        }

        setErrors(newErrors);

        if (isValid) {
            // Convert the form values back to numbers before saving.
            onSave({
                id: editedBudget.id,
                name: editedBudget.name,
                budgeted: Number(editedBudget.budgeted),
                spent: Number(editedBudget.spent),
            });
            setIsOpen(false);
        }
    };

    if (!editedBudget) return null;

    return (
        <Credenza
            open={isOpen}
            onOpenChange={setIsOpen}>
            <CredenzaContent className='sm:max-w-[425px]'>
                <CredenzaHeader>
                    <CredenzaTitle>Edit Budget</CredenzaTitle>
                    <CredenzaDescription>Update your budget category details</CredenzaDescription>
                </CredenzaHeader>
                <form onSubmit={handleSave}>
                    <div className='w-11/12 grid gap-4 py-4'>
                        {/* Name Field */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='name'
                                className='text-right'>
                                Name
                            </Label>
                            <div className='col-span-3'>
                                <Input
                                    id='name'
                                    type='text'
                                    value={editedBudget.name}
                                    onChange={(e) => setEditedBudget({ ...editedBudget, name: e.target.value })}
                                />
                                {errors.name && <p className='text-xs text-red-500'>{errors.name}</p>}
                            </div>
                        </div>
                        {/* Budget Field */}
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
                                    value={editedBudget.budgeted}
                                    onChange={(e) =>
                                        setEditedBudget({
                                            ...editedBudget,
                                            budgeted: e.target.value,
                                        })
                                    }
                                />
                                {errors.budgeted && <p className='text-xs text-red-500'>{errors.budgeted}</p>}
                            </div>
                        </div>
                        {/* Spent Field */}
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
                                    value={editedBudget.spent}
                                    onChange={(e) =>
                                        setEditedBudget({
                                            ...editedBudget,
                                            spent: e.target.value,
                                        })
                                    }
                                />
                                {errors.spent && <p className='text-xs text-red-500'>{errors.spent}</p>}
                            </div>
                        </div>
                    </div>
                    <CredenzaFooter className='w-11/12 mx-auto'>
                        <Button type='submit'>Save Changes</Button>
                        <CredenzaClose asChild>
                            <Button variant='outline'>Cancel</Button>
                        </CredenzaClose>
                    </CredenzaFooter>
                </form>
            </CredenzaContent>
        </Credenza>
    );
};
