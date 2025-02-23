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
import { DatePicker } from "@/components/ui/date-picker";
import { PiggyBank } from "lucide-react";
import { validateGoalForm } from "@/lib/validations/validate_goal_form";
import { fromUnixTimestamp, getToken } from "@/lib/utils";
import { instantiateAPI } from "@/lib/api_utils";
import type { EditGoalDialogProps, EditedGoalForm, GoalResponse } from "@/types/goals.types";

export const EditGoalDialog: React.FC<EditGoalDialogProps> = ({ goal, isOpen, setIsOpen, onSave }) => {
    const [editedGoal, setEditedGoal] = useState<EditedGoalForm>({
        _id: "",
        name: "",
        target: "",
        current: "",
        targetDate: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        target: "",
        current: "",
        targetDate: "",
    });

    useEffect(() => {
        if (goal) {
            setEditedGoal({
                _id: goal._id,
                name: goal.name,
                target: goal.target.toString(),
                current: goal.current.toString(),
                targetDate: goal.targetDate.toString(),
            });
            setErrors({ name: "", target: "", current: "", targetDate: "" });
        }
    }, [goal]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editedGoal) return;

        const { isValid, errors } = validateGoalForm(editedGoal);
        setErrors(errors);

        if (isValid) {
            try {
                const payload = {
                    name: editedGoal.name,
                    totalAmount: Number(editedGoal.target),
                    currentAmount: Number(editedGoal.current),
                    targetDate: Number(editedGoal.targetDate),
                };

                const api = instantiateAPI("http://localhost:3000/api");
                const token = getToken();

                // Make the PUT request directly here
                const updatedGoal = await api.patch<GoalResponse>(
                    `/finance/goal?id=${editedGoal._id}`,
                    payload,
                    token ?? ""
                );

                const formattedGoal = {
                    _id: updatedGoal._id,
                    name: updatedGoal.name,
                    target: Number(updatedGoal.totalAmount),
                    current: Number(updatedGoal.currentAmount),
                    targetDate: updatedGoal.targetDate,
                    status: Boolean(updatedGoal.status),
                };

                onSave(formattedGoal);
                setIsOpen(false);
            } catch (error) {
                console.error("Error updating goal:", error);
            }
        }
    };

    return (
        <Credenza
            open={isOpen}
            onOpenChange={setIsOpen}>
            <CredenzaContent className='sm:max-w-[425px]'>
                <CredenzaHeader>
                    <CredenzaTitle className='flex items-center justify-center md:justify-start'>
                        <PiggyBank className='size-5 me-2' />
                        Edit Goal
                    </CredenzaTitle>
                    <CredenzaDescription>Update your goal details</CredenzaDescription>
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
                                    value={editedGoal.name}
                                    onChange={(e) => setEditedGoal({ ...editedGoal, name: e.target.value })}
                                />
                                {errors.name && <p className='text-xs text-red-500'>{errors.name}</p>}
                            </div>
                        </div>

                        {/* Target Field */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='target'
                                className='text-right'>
                                Target
                            </Label>
                            <div className='col-span-3'>
                                <Input
                                    id='target'
                                    type='number'
                                    value={editedGoal.target}
                                    onChange={(e) => setEditedGoal({ ...editedGoal, target: e.target.value })}
                                />
                                {errors.target && <p className='text-xs text-red-500'>{errors.target}</p>}
                            </div>
                        </div>

                        {/* Current Field */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='current'
                                className='text-right'>
                                Current
                            </Label>
                            <div className='col-span-3'>
                                <Input
                                    id='current'
                                    type='number'
                                    value={editedGoal.current}
                                    onChange={(e) => setEditedGoal({ ...editedGoal, current: e.target.value })}
                                />
                                {errors.current && <p className='text-xs text-red-500'>{errors.current}</p>}
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
                                    date={fromUnixTimestamp(Number(editedGoal.targetDate))}
                                    onSelect={(selectedDate) =>
                                        setEditedGoal({
                                            ...editedGoal,
                                            targetDate: selectedDate ? Math.floor(selectedDate.getTime() / 1000) : "",
                                        })
                                    }
                                />
                                {errors.targetDate && <p className='text-xs text-red-500'>{errors.targetDate}</p>}
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

export default EditGoalDialog;
