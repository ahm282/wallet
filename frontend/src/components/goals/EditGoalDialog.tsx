import React, { useState, useEffect } from "react";
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
import { fromUnixTimestamp } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { EditGoalDialogProps, EditedGoalForm } from "@/types/goals.types";

export const EditGoalDialog: React.FC<EditGoalDialogProps> = ({ goal, isOpen, setIsOpen, onSave }) => {
    // Local state for editing; numeric fields are stored as strings.
    const [editedGoal, setEditedGoal] = useState<EditedGoalForm>({
        id: "",
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

    // Determine if we're on desktop.
    const isDesktop = useMediaQuery("(min-width: 768px)");

    // When the goal prop changes, initialize local state.
    useEffect(() => {
        if (goal) {
            setEditedGoal({
                id: goal.id,
                name: goal.name,
                targetAmount: goal.targetAmount.toString(),
                currentAmount: goal.currentAmount.toString(),
                targetDate: goal.targetDate.toString(),
            });
            setErrors({ name: "", targetAmount: "", currentAmount: "", targetDate: "" });
        }
    }, [goal]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editedGoal) return;

        // Convert the numeric fields back to numbers.
        const updatedGoal = {
            id: editedGoal.id,
            name: editedGoal.name,
            targetAmount: Number(editedGoal.targetAmount),
            currentAmount: Number(editedGoal.currentAmount),
            targetDate: Number(editedGoal.targetDate),
        };

        const { isValid, errors } = validateGoalForm(editedGoal);
        setErrors(errors);

        if (isValid) {
            onSave(updatedGoal);
            setIsOpen(false);
        }
    };

    const handleFieldChange = <K extends keyof EditedGoalForm>(field: K, value: EditedGoalForm[K]) => {
        setEditedGoal({
            ...editedGoal,
            [field]: value,
        });
        if (errors[field as keyof typeof errors]) {
            setErrors({
                ...errors,
                [field]: "",
            });
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
                                    onChange={(e) => handleFieldChange("name", e.target.value)}
                                />
                                {errors.name && <p className='text-xs text-red-500'>{errors.name}</p>}
                            </div>
                        </div>
                        {/* Target Amount Field */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='target'
                                className='text-right'>
                                Target
                            </Label>
                            <div className='col-span-3'>
                                <Input
                                    id='target'
                                    // Use "text" on desktop for flexible editing and "number" on mobile.
                                    type={isDesktop ? "text" : "number"}
                                    value={editedGoal.targetAmount}
                                    onChange={(e) => handleFieldChange("targetAmount", e.target.value)}
                                />
                                {errors.targetAmount && <p className='text-xs text-red-500'>{errors.targetAmount}</p>}
                            </div>
                        </div>
                        {/* Current Amount Field */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='current'
                                className='text-right'>
                                Current
                            </Label>
                            <div className='col-span-3'>
                                <Input
                                    id='current'
                                    type={isDesktop ? "text" : "number"}
                                    value={editedGoal.currentAmount}
                                    onChange={(e) => handleFieldChange("currentAmount", e.target.value)}
                                />
                                {errors.currentAmount && <p className='text-xs text-red-500'>{errors.currentAmount}</p>}
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
                                    date={
                                        editedGoal.targetDate
                                            ? fromUnixTimestamp(Number(editedGoal.targetDate))
                                            : undefined
                                    }
                                    onSelect={(selectedDate) =>
                                        handleFieldChange(
                                            "targetDate",
                                            selectedDate ? Math.floor(selectedDate.getTime() / 1000).toString() : ""
                                        )
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
