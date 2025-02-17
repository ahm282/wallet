import { PiggyBank, Edit2, Trash2, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AddGoalDialog } from "@/components/goals/AddGoalDialog";
import { EditGoalDialog } from "@/components/goals/EditGoalDialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { currencyNotation } from "@/lib/utils";
import { DeleteWarning } from "@/components/ui/delete-warning";
import type { GoalsDataExistsProps, Goal } from "@/types/types";

export const GoalsDataExists: React.FC<GoalsDataExistsProps> = ({ goals, setGoals }) => {
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleEdit = (goal: Goal) => {
        setEditingGoal(goal);
        setIsEditDialogOpen(true);
    };

    const handleSaveEdit = (updatedGoal: Goal) => {
        setGoals(goals.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)));
        setEditingGoal(null);
    };

    const handleDelete = (id: number) => {
        setGoals(goals.filter((g) => g.id !== id));
    };

    const totalTarget = goals.reduce((acc, goal) => acc + goal.target, 0);
    const totalSaved = goals.reduce((acc, goal) => acc + goal.current, 0);

    return (
        <div className='w-11/12 md:w-10/12 lg:max-w-4xl 2xl:max-w-5xl my-8 mx-auto flex flex-col space-y-5'>
            <Card>
                <CardHeader className='pb-4'>
                    <CardTitle className='text-2xl font-bold flex flex-row items-center justify-between'>
                        <div className='flex items-center'>
                            <PiggyBank className='inline size-7 me-3' />
                            <span>Goals</span>
                        </div>
                        <AddGoalDialog
                            goals={goals}
                            setGoals={setGoals}
                        />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className={`space-y-3 ${goals.length >= 5 ? "max-h-[500px] overflow-y-auto lg:px-4" : ""}`}>
                        {goals.map((goal, index) => (
                            <div
                                key={goal.id}
                                className='space-y-2'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex flex-col gap-y-0.5'>
                                        <span className='text-sm font-medium'>{goal.name}</span>
                                    </div>
                                    <div className='flex items-center lg:gap-4'>
                                        <div className='flex justify-center items-center gap-y-1 gap-x-0.5'>
                                            <Button
                                                variant='ghost'
                                                size='xl'
                                                className='px-2 !max-h-12 rounded-md hover:text-blue-500'
                                                onClick={() => handleEdit(goal)}>
                                                <Edit2 className='!size-4' />
                                            </Button>
                                            <DeleteWarning
                                                icon={Trash2}
                                                message='Are you sure you want to delete this goal? This action cannot be undone.'
                                                onConfirm={() => handleDelete(goal.id)}>
                                                <Button
                                                    variant='ghost'
                                                    size='xl'
                                                    className='px-2 !max-h-12 rounded-md hover:text-red-500'>
                                                    <Trash2 className='!size-4' />
                                                </Button>
                                            </DeleteWarning>
                                        </div>
                                    </div>
                                </div>
                                <Progress
                                    value={(goal.current / goal.target) * 100}
                                    className='h-2'
                                />
                                <div className='flex justify-between text-sm pt-0.5'>
                                    <span>
                                        {currencyNotation(goal.current)} / {currencyNotation(goal.target)}
                                    </span>
                                    <span>{((goal.current / goal.target) * 100).toFixed(0)}% achieved</span>
                                </div>
                                <div className='flex justify-between text-xs pt-0.5 text-muted-foreground'>
                                    <span className='text-xs font-medium text-muted-foreground'>
                                        Target date: {goal.targetDate}
                                    </span>
                                    <span>{currencyNotation(goal.target - goal.current)} remaining</span>
                                </div>
                                {index !== goals.length - 1 && (
                                    <Separator className='w-10/12 lg:w-11/12 mx-auto !mt-4' />
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <EditGoalDialog
                goal={editingGoal}
                isOpen={isEditDialogOpen}
                setIsOpen={setIsEditDialogOpen}
                onSave={handleSaveEdit}
            />

            {/* Single summary card for goals */}
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
                    <CardTitle className='text-sm font-medium'>Goals Summary</CardTitle>
                    <Target className='size-5' />
                </CardHeader>
                <CardContent>
                    <div className='space-y-2'>
                        <div className='flex justify-between'>
                            <span className='text-sm font-medium'>Total Goals Value:</span>
                            <span className='text-sm font-medium'>{currencyNotation(totalTarget)}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-sm font-medium'>Total Saved:</span>
                            <span className='text-sm font-medium'>{currencyNotation(totalSaved)}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-sm font-medium'>Overall Progress:</span>
                            <span className='text-sm font-medium'>
                                {totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(0) : "0"}%
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default GoalsDataExists;
