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
import type { AddBudgetDialogProps } from "@/types/types";

export const AddBudgetDialog: React.FC<AddBudgetDialogProps> = ({ budgets, setBudgets }) => {
    const [newBudget, setNewBudget] = useState({ name: "", budgeted: "", spent: "" });
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const handleAddBudget = (e: React.FormEvent) => {
        e.preventDefault();
        if (newBudget.name && newBudget.budgeted) {
            setBudgets([
                ...budgets,
                {
                    id: budgets.length + 1,
                    ...newBudget,
                    budgeted: Number.parseFloat(newBudget.budgeted),
                    spent: Number.parseFloat(newBudget.spent) || 0,
                },
            ]);
            setNewBudget({ name: "", budgeted: "", spent: "" });
            setIsAddDialogOpen(false);
        }
    };

    return (
        <>
            <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className='mr-2 h-4 w-4' /> Add Budget
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
                                <Input
                                    id='name'
                                    value={newBudget.name}
                                    onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })}
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
                                    value={newBudget.budgeted}
                                    onChange={(e) => setNewBudget({ ...newBudget, budgeted: e.target.value })}
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
                                    value={newBudget.spent}
                                    onChange={(e) => setNewBudget({ ...newBudget, spent: e.target.value })}
                                    className='col-span-3'
                                />
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
