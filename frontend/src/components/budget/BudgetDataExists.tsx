import { EuroIcon, ScanHeart, HandCoins, PiggyBank, Wallet, Edit2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AddBudgetDialog } from "@/components/budget/AddBudgetDialog";
import { EditBudgetDialog } from "@/components/budget/EditBudgetDialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { currencyNotation } from "@/lib/utils";
import { DeleteWarning } from "@/components/ui/delete-warning";
import type { BudgetDataExistsProps, Budget } from "@/types/types";

export const BudgetDataExists: React.FC<BudgetDataExistsProps> = ({ budgets, setBudgets }) => {
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleEdit = (budget: Budget) => {
        setEditingBudget(budget);
        setIsEditDialogOpen(true);
    };

    const handleSaveEdit = (updatedBudget: Budget) => {
        setBudgets(budgets.map((b) => (b.id === updatedBudget.id ? updatedBudget : b)));
        setEditingBudget(null);
    };

    const handleDelete = (id: number) => {
        setBudgets(budgets.filter((b) => b.id !== id));
    };

    const totalBudgeted = budgets.reduce((acc, budget) => acc + budget.budgeted, 0);
    const totalSpent = budgets.reduce((acc, budget) => acc + budget.spent, 0);

    return (
        <div className='w-11/12 md:w-10/12 lg:max-w-4xl 2xl:max-w-5xl my-8 mx-auto flex flex-col space-y-5'>
            <Card>
                <CardHeader className='space-y-0 pb-8'>
                    <CardTitle className='text-2xl font-bold flex flex-row items-center justify-between'>
                        <div className='flex items-center'>
                            <EuroIcon className='inline size-7 me-3' />
                            <span>Budgets</span>
                        </div>
                        <AddBudgetDialog
                            budgets={budgets}
                            setBudgets={setBudgets}
                        />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className={`space-y-5 ${budgets.length >= 5 ? "max-h-[500px] overflow-y-auto lg:px-4" : ""}`}>
                        {budgets.map((budget, index) => (
                            <div
                                key={budget.id}
                                className='space-y-2'>
                                <div className='flex items-center justify-between'>
                                    <span className='text-sm font-medium'>{budget.name}</span>
                                    <div className='flex item-center lg:gap-4'>
                                        <span className='me-2 text-xs font-medium lg:text-sm'>
                                            {currencyNotation(budget.spent)} / {currencyNotation(budget.budgeted)}
                                        </span>
                                        <div className='flex justify-center items-center gap-y-1 gap-x-0.5'>
                                            <Separator
                                                orientation='horizontal'
                                                className='w-0.5 bg-muted h-6'
                                            />
                                            <Button
                                                variant='ghost'
                                                size='xl'
                                                className='px-2 !max-h-12 rounded-md hover:text-blue-500'
                                                onClick={() => handleEdit(budget)}>
                                                <Edit2 className='!size-4' />
                                            </Button>
                                            <DeleteWarning
                                                icon={Trash2}
                                                message='Are you sure you want to delete this budget? This action cannot be undone.'
                                                onConfirm={() => handleDelete(budget.id)}>
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
                                    value={(budget.spent / budget.budgeted) * 100}
                                    className='h-2'
                                />
                                <div className='flex justify-between text-xs text-muted-foreground pt-0.5'>
                                    <span>{((budget.spent / budget.budgeted) * 100).toFixed(0)}% spent</span>
                                    <span>€{budget.budgeted - budget.spent} remaining</span>
                                </div>
                                {index !== budgets.length - 1 && (
                                    <Separator className='w-10/12 lg:w-11/12 mx-auto !mt-4' />
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <EditBudgetDialog
                budget={editingBudget}
                isOpen={isEditDialogOpen}
                setIsOpen={setIsEditDialogOpen}
                onSave={handleSaveEdit}
            />
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Budgeted</CardTitle>
                        <Wallet className='size-5 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{currencyNotation(totalBudgeted)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Spent</CardTitle>
                        <HandCoins className='size-5 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{currencyNotation(totalSpent)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Remaining</CardTitle>
                        <PiggyBank className='size-5 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {currencyNotation(calculateRemaining(totalBudgeted, totalSpent))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Budget Health</CardTitle>
                        <ScanHeart className='size-5 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{budgetHealth(totalBudgeted, totalSpent)}</div>
                        <p className='text-xs text-muted-foreground pt-2'>
                            <span className='font-extrabold'>
                                {calculateRemainingPercent(totalBudgeted, totalSpent)}%
                            </span>
                            &nbsp;of budget remaining
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

function budgetHealth(totalBudgeted: number, totalSpent: number) {
    const percentage = ((totalBudgeted - totalSpent) / totalBudgeted) * 100;

    if (percentage > 75) {
        return "Good";
    } else if (percentage > 35) {
        return "Average";
    } else {
        return "Needs Attention";
    }
}

function calculateRemaining(totalBudgeted: number, totalSpent: number) {
    return totalBudgeted - totalSpent;
}

function calculateRemainingPercent(totalBudgeted: number, totalSpent: number) {
    return (((totalBudgeted - totalSpent) / totalBudgeted) * 100).toFixed(0);
}

export default BudgetDataExists;
