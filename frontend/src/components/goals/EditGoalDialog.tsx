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
import type { EditGoalDialogProps, EditedGoalForm } from "@/types/types";
import { validateGoalForm } from "@/lib/validate_goal_forms";

export const EditGoalDialog: React.FC<EditGoalDialogProps> = ({ goal, isOpen, setIsOpen, onSave }) => {
    const [editedGoal, setEditedGoal] = useState<EditedGoalForm | null>(null);
    const [errors, setErrors] = useState({
        name: "",
        target: "",
        current: "",
        targetDate: "",
    });

    useEffect(() => {
        if (goal) {
            setEditedGoal({
                id: goal.id,
                name: goal.name,
                target: goal.target.toString(),
                current: goal.current.toString(),
                targetDate: goal.targetDate,
            });
            // Reset errors when a new goal is loaded.
            setErrors({ name: "", target: "", current: "", targetDate: "" });
        }
    }, [goal]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editedGoal) return;

        const { isValid, errors } = validateGoalForm(editedGoal);
        setErrors(errors);

        if (isValid) {
            onSave({
                id: editedGoal.id,
                name: editedGoal.name,
                target: Number(editedGoal.target),
                current: Number(editedGoal.current),
                targetDate: editedGoal.targetDate,
            });
            setIsOpen(false);
        }
    };

    if (!editedGoal) return null;

    return (
        <Credenza
            open={isOpen}
            onOpenChange={setIsOpen}>
            <CredenzaContent className='sm:max-w-[425px]'>
                <CredenzaHeader>
                    <CredenzaTitle>Edit Goal</CredenzaTitle>
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
                                    type='text'
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
                                    type='text'
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
                                <Input
                                    id='targetDate'
                                    type='date'
                                    value={editedGoal.targetDate}
                                    onChange={(e) => setEditedGoal({ ...editedGoal, targetDate: e.target.value })}
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
