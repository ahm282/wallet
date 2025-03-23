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
import { EuroIcon } from "lucide-react";
import { validateBudgetForm } from "@/lib/validations/validate_budget_form";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { Budget, EditBudgetDialogProps } from "@/types/budget.types";

export const EditBudgetDialog: React.FC<EditBudgetDialogProps> = ({ budget, isOpen, setIsOpen, onSave }) => {
    const [editedBudget, setEditedBudget] = useState<Budget | null>(null);
    const [errors, setErrors] = useState({
        name: "",
        budgeted: "",
        spent: "",
    });
    const isDesktop = useMediaQuery("(min-width: 768px)");

    useEffect(() => {
        if (budget) {
            setEditedBudget(budget);
            setErrors({ name: "", budgeted: "", spent: "" });
        }
    }, [budget]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editedBudget) return;

        // Convert budgeted and spent from string to number before submission.
        const updatedBudget: Budget = {
            ...editedBudget,
            budgeted: Number(editedBudget.budgeted),
            spent: Number(editedBudget.spent),
        };

        const { isValid, errors } = validateBudgetForm(updatedBudget);
        setErrors(errors);

        if (isValid) {
            onSave(updatedBudget);
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
                    <CredenzaTitle className='flex items-center justify-center md:justify-start'>
                        <EuroIcon className='size-5 me-2' />
                        Edit Budget
                    </CredenzaTitle>
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
                                    type={isDesktop ? "text" : "number"}
                                    value={editedBudget.budgeted?.toString()}
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
                                    type={isDesktop ? "text" : "number"}
                                    value={editedBudget.spent?.toString()}
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

export default EditBudgetDialog;
