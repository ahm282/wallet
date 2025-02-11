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
import type { Budget } from "@/types/types";

interface EditBudgetDialogProps {
    budget: Budget | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onSave: (budget: Budget) => void;
}

export const EditBudgetDialog: React.FC<EditBudgetDialogProps> = ({ budget, isOpen, setIsOpen, onSave }) => {
    const [editedBudget, setEditedBudget] = useState<Budget | null>(null);

    useEffect(() => {
        if (budget) {
            setEditedBudget(budget);
        }
    }, [budget]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editedBudget && editedBudget.name && editedBudget.budgeted) {
            onSave({
                ...editedBudget,
                budgeted: Number(editedBudget.budgeted),
                spent: Number(editedBudget.spent) || 0,
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
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='name'
                                className='text-right'>
                                Name
                            </Label>
                            <Input
                                id='name'
                                value={editedBudget.name}
                                onChange={(e) => setEditedBudget({ ...editedBudget, name: e.target.value })}
                                className='col-span-3'
                            />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='budgeted'
                                className='text-right'>
                                Budget
                            </Label>
                            <Input
                                id='budgeted'
                                type='number'
                                value={editedBudget.budgeted}
                                onChange={(e) => setEditedBudget({ ...editedBudget, budgeted: Number(e.target.value) })}
                                className='col-span-3'
                            />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='spent'
                                className='text-right'>
                                Spent
                            </Label>
                            <Input
                                id='spent'
                                type='number'
                                value={editedBudget.spent}
                                onChange={(e) => setEditedBudget({ ...editedBudget, spent: Number(e.target.value) })}
                                className='col-span-3'
                            />
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
