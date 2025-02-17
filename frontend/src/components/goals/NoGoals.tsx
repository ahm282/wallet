import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Ambulance, House, Leaf, Ruler, CalendarClock, Milestone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddGoalDialog } from "@/components/goals/AddGoalDialog";
import type { NoGoalsProps } from "@/types/types";
import GoalSettingGuide from "./GoalSettingGuide";

export const NoGoals: React.FC<NoGoalsProps> = ({ goals, setGoals }) => {
    const [isGoalsGuideOpen, setIsGoalsGuideOpen] = useState(false);

    return (
        <div className='w-11/12 md:w-10/12 lg:w-7/12 2xl:w-6/12 my-8 mx-auto flex flex-col space-y-3'>
            <Card>
                <CardHeader>
                    <CardTitle>Set Your Financial Goals</CardTitle>
                    <CardDescription>Start planning for your future by setting financial goals</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                    <div className='space-y-2'>
                        <p className='text-sm text-muted-foreground'>
                            Setting financial goals helps you stay motivated and track your progress towards important
                            milestones.&nbsp;&nbsp;🚀
                        </p>
                    </div>
                    <AddGoalDialog
                        goals={goals}
                        setGoals={setGoals}></AddGoalDialog>
                </CardContent>
            </Card>
            <div className='flex flex-col items-center justify-center lg:flex-row lg:justify-evenly lg:space-x-4 space-y-3 lg:space-y-0'>
                <Card className='w-full'>
                    <CardHeader>
                        <CardTitle>Goal ideas</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        <div className='flex items-center'>
                            <Ambulance className='me-2 size-4 text-muted-foreground' />
                            <span className='text-sm'>Build an emergency fund</span>
                        </div>
                        <div className='flex items-center'>
                            <House className='me-2 size-4 text-muted-foreground' />
                            <span className='text-sm'>Save for a down payment on a house</span>
                        </div>
                        <div className='flex items-center'>
                            <Leaf className='me-2 size-4 text-muted-foreground' />
                            <span className='text-sm'>Plan for retirement</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className='w-full'>
                    <CardHeader>
                        <CardTitle>Tips for successful goal setting</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        <div className='flex items-center'>
                            <Ruler className='me-2 size-4 text-muted-foreground' />
                            <span className='text-sm'>Make your goals specific and measurable</span>
                        </div>
                        <div className='flex items-center'>
                            <CalendarClock className='me-2 size-4 text-muted-foreground' />
                            <span className='text-sm'>Set realistic timeframes</span>
                        </div>
                        <div className='flex items-center'>
                            <Milestone className='me-2 size-4 text-muted-foreground' />
                            <span className='text-sm'>Break large goals into smaller milestones</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Not sure where to start?</CardTitle>
                    <CardDescription>
                        Read our guide to get started and discover strategies for setting your goals.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        variant='link'
                        onClick={() => setIsGoalsGuideOpen(true)}
                        className='p-0'>
                        Read Goal Setting Guide
                        <ArrowRight className='size-4' />
                    </Button>
                </CardContent>
            </Card>
            <GoalSettingGuide
                isOpen={isGoalsGuideOpen}
                onClose={() => setIsGoalsGuideOpen(false)}
            />
        </div>
    );
};

export default NoGoals;
