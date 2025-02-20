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
import { ApiUtil } from "@/lib/api_utils";
import { useAuthStore } from "@/store/authStore";
import { validateGoalForm } from "@/lib/validations/validate_goal_form";
import type { AddGoalDialogProps, GoalForm, GoalResponse } from "@/types/goals.types";

async function postGoalData(payload: object): Promise<GoalResponse> {
    const { token, user } = useAuthStore.getState();
    const data = {
        ...payload,
        userId: user?.id,
    };
    const api = import.meta.env.VITE_ENV_NAME === "dev" ? new ApiUtil("http://localhost:8080/api") : new ApiUtil();
    return api.post<GoalResponse>("/goal", data, token ?? "");
}

export const AddGoalDialog: React.FC<AddGoalDialogProps> = ({ goals, setGoals }) => {
    const [newGoal, setNewGoal] = useState<GoalForm>({
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
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const handleAddGoal = async (e: React.FormEvent) => {
        e.preventDefault();

        const { isValid, errors } = validateGoalForm(newGoal);
        setErrors(errors);

        if (isValid) {
            const payload = {
                name: newGoal.name,
                target: Number(newGoal.target),
                current: newGoal.current ? Number(newGoal.current) : 0,
                targetDate: newGoal.targetDate,
            };

            const goalResponse = await postGoalData(payload);

            console.log("Goal Response:", goalResponse);
            console.log("New Goal:", newGoal);

            setGoals([
                ...goals,
                {
                    id: goalResponse.id,
                    name: goalResponse.name,
                    target: goalResponse.target,
                    current: goalResponse.current,
                    targetDate: goalResponse.targetDate,
                },
            ]);

            // Reset the form and errors
            setNewGoal({ name: "", target: "", current: "", targetDate: "" });
            setErrors({ name: "", target: "", current: "", targetDate: "" });
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
                                    htmlFor='target'
                                    className='text-right'>
                                    Target
                                </Label>
                                <div className='col-span-3'>
                                    <Input
                                        id='target'
                                        type='text'
                                        value={newGoal.target}
                                        onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
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
                                        value={newGoal.current}
                                        onChange={(e) => setNewGoal({ ...newGoal, current: e.target.value })}
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
