import { useState } from "react";
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
import { EuroIcon, Plus } from "lucide-react";
import { validateBudgetForm } from "@/lib/validations/validate_budget_form";
import type { AddBudgetDialogProps, BudgetForm } from "@/types/budget.types";

export const AddBudgetDialog: React.FC<AddBudgetDialogProps> = ({ createBudgetMutation }) => {
    const [newBudget, setNewBudget] = useState<BudgetForm>({
        name: "",
        budgeted: null,
        spent: null,
    });
    const [errors, setErrors] = useState({
        name: "",
        budgeted: "",
        spent: "",
    });
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const handleAddBudget = (e: React.FormEvent) => {
        e.preventDefault();
        const { isValid, errors: validationErrors } = validateBudgetForm(newBudget);
        if (isValid) {
            createBudgetMutation?.mutate(newBudget);

            // Reset the form and errors
            setNewBudget({ name: "", budgeted: 0, spent: 0 });
            setErrors({ name: "", budgeted: "", spent: "" });
            setIsAddDialogOpen(false);
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <>
            <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className='me-2 size-4' /> Add Budget
            </Button>
            <Credenza
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}>
                <CredenzaContent className='sm:max-w-[425px]'>
                    <CredenzaHeader>
                        <CredenzaTitle className='flex items-center justify-center md:justify-start'>
                            <EuroIcon className='size-5 me-2' />
                            Add New Budget
                        </CredenzaTitle>
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
                                        value={newBudget.budgeted !== null ? newBudget.budgeted.toString() : ""}
                                        onChange={(e) =>
                                            setNewBudget({
                                                ...newBudget,
                                                budgeted: parseFloat(e.target.value) || e.target.value,
                                            })
                                        }
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
                                        value={newBudget.spent !== null ? newBudget.spent.toString() : ""}
                                        onChange={(e) =>
                                            setNewBudget({
                                                ...newBudget,
                                                spent: parseFloat(e.target.value) || e.target.value,
                                            })
                                        }
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
