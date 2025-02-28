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
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { Plus, PiggyBank } from "lucide-react";
import { validateGoalForm } from "@/lib/validations/validate_goal_form";
import type { AddGoalDialogProps, GoalForm } from "@/types/goals.types";

export const AddGoalDialog: React.FC<AddGoalDialogProps> = ({ createGoalMutation }) => {
    const [newGoal, setNewGoal] = useState<GoalForm>({
        name: "",
        targetAmount: "",
        currentAmount: "",
        targetDate: "",
    });
    const [errors, setErrors] = useState({
        name: "",
        targetAmount: "",
        currentAmount: "",
        targetDate: "",
    });
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const handleAddGoal = async (e: React.FormEvent) => {
        e.preventDefault();

        const { isValid, errors } = validateGoalForm(newGoal);
        setErrors(errors);

        if (isValid) {
            const payload = {
                name: newGoal.name,
                targetAmount: Number(newGoal.targetAmount),
                currentAmount: newGoal.currentAmount ? Number(newGoal.currentAmount) : 0,
                targetDate: newGoal.targetDate,
            };

            createGoalMutation?.mutate(payload);

            // Reset the form and errors
            setNewGoal({ name: "", targetAmount: "", currentAmount: "", targetDate: "" });
            setErrors({ name: "", targetAmount: "", currentAmount: "", targetDate: "" });
            setIsAddDialogOpen(false);
        }
    };

    if (!newGoal) return null;

    return (
        <>
            <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className='mr-2 size-4' /> Add a Goal
            </Button>
            <Credenza
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}>
                <CredenzaContent className='sm:max-w-[425px]'>
                    <CredenzaHeader>
                        <CredenzaTitle className='flex items-center justify-center md:justify-start'>
                            <PiggyBank className='size-5 me-2' />
                            Add New Goal
                        </CredenzaTitle>
                        <CredenzaDescription>Create a new financial goal to track your progress</CredenzaDescription>
                    </CredenzaHeader>
                    <form onSubmit={handleAddGoal}>
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
                                        value={newGoal.name}
                                        onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                                    />
                                    {errors.name && <p className='text-xs text-red-500'>{errors.name}</p>}
                                </div>
                            </div>
                            {/* Target Field */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label
                                    htmlFor='targetAmount'
                                    className='text-right'>
                                    Target
                                </Label>
                                <div className='col-span-3'>
                                    <Input
                                        id='targetAmount'
                                        type='text'
                                        value={newGoal.targetAmount}
                                        onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                                    />
                                    {errors.targetAmount && (
                                        <p className='text-xs text-red-500'>{errors.targetAmount}</p>
                                    )}
                                </div>
                            </div>
                            {/* Current Field */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label
                                    htmlFor='currentAmount'
                                    className='text-right'>
                                    Current
                                </Label>
                                <div className='col-span-3'>
                                    <Input
                                        id='currentAmount'
                                        type='text'
                                        value={newGoal.currentAmount}
                                        onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                                    />
                                    {errors.currentAmount && (
                                        <p className='text-xs text-red-500'>{errors.currentAmount}</p>
                                    )}
                                </div>
                            </div>
                            {/* Target Date Field */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label
                                    htmlFor='targetDate'
                                    className='text-right'>
                                    Target Date
                                </Label>
                                <div className='col-span-3'>
                                    <DatePicker
                                        date={newGoal.targetDate ? new Date(newGoal.targetDate) : undefined}
                                        onSelect={(selectedDate) =>
                                            setNewGoal({
                                                ...newGoal,
                                                targetDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
                                            })
                                        }
                                    />
                                    {errors.targetDate && <p className='text-xs text-red-500'>{errors.targetDate}</p>}
                                </div>
                            </div>
                        </div>
                        <CredenzaFooter className='w-11/12 mx-auto'>
                            <Button type='submit'>
                                <Plus className='mr-2 size-4' /> Add Goal
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

export default AddGoalDialog;
