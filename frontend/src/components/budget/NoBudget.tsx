import BudgettingGuide from "./BudgettingGuide";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, PieChart, ArrowRight } from "lucide-react";
import { AddBudgetDialog } from "@/components/budget/AddBudgetDialog";
import { useState } from "react";
import type { NoBudgetProps } from "@/types/budget.types";

export const NoBudget: React.FC<NoBudgetProps> = ({ budgets, createBudgetMutation }) => {
    const [isBudgetGuideOpen, setisBudgetGuideOpen] = useState(false);

    return (
        <div className='md:w-10/12 lg:w-10/12 lg:max-w-4xl 2xl:max-w-5xl my-8 mx-auto flex flex-col space-y-3'>
            <Card>
                <CardHeader>
                    <CardTitle>Welcome to Your Budget Planner</CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                    <div className='space-y-2'>
                        <p className='text-sm text-muted-foreground'>
                            Start managing your finances by creating your first budget.&nbsp;&nbsp;🙂
                        </p>
                        <p className='text-sm text-muted-foreground'>
                            Creating a budget helps you track your income and expenses, allowing you to make informed
                            financial decisions.
                        </p>
                    </div>
                    <AddBudgetDialog
                        budgets={budgets}
                        createBudgetMutation={createBudgetMutation}
                    />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Why Create a Budget?</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                    <div className='flex items-center'>
                        <DollarSign className='me-2 size-4 text-muted-foreground' />
                        <span className='text-sm'>Track your spending</span>
                    </div>
                    <div className='flex items-center'>
                        <PieChart className='me-2 size-4 text-muted-foreground' />
                        <span className='text-sm'>Allocate funds to different categories</span>
                    </div>
                    <div className='flex items-center'>
                        <ArrowRight className='me-2 size-4 text-muted-foreground' />
                        <span className='text-sm'>Work towards your financial goals</span>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Need Help Getting Started?</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                    <p className='text-sm text-muted-foreground'>
                        Check out our guide on creating an effective budget:
                    </p>

                    <Button
                        variant='link'
                        onClick={() => setisBudgetGuideOpen(true)}
                        className='p-0'>
                        Read Budgetting Guide <ArrowRight className='size-4' />
                    </Button>
                </CardContent>
            </Card>
            <BudgettingGuide
                isOpen={isBudgetGuideOpen}
                onClose={() => setisBudgetGuideOpen(false)}
            />
        </div>
    );
};

export default NoBudget;
