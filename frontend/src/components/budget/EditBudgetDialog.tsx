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
import { validateBudgetForm } from "@/lib/validations/validate_budget_form";
import type { EditBudgetDialogProps, EditedBudgetForm } from "@/types/budget.types";

export const EditBudgetDialog: React.FC<EditBudgetDialogProps> = ({ budget, isOpen, setIsOpen, onSave }) => {
    const [editedBudget, setEditedBudget] = useState<EditedBudgetForm>({
        id: "",
        name: "",
        budgeted: "",
        spent: "",
    });
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

            setErrors({ name: "", budgeted: "", spent: "" });
        }
    }, [budget]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Validate the form using the current state.
        const { isValid, errors: validationErrors } = validateBudgetForm(editedBudget);
        if (isValid) {
            onSave({
                id: editedBudget.id,
                name: editedBudget.name,
                budgeted: Number(editedBudget.budgeted),
                spent: Number(editedBudget.spent),
            });
            setIsOpen(false);
            setErrors({ name: "", budgeted: "", spent: "" });
        } else {
            setErrors(validationErrors);
        }
    };

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
                                    onChange={(e) => setEditedBudget({ ...editedBudget, budgeted: e.target.value })}
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
                                    onChange={(e) => setEditedBudget({ ...editedBudget, spent: e.target.value })}
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
