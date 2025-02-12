import BudgettingGuide from "./BudgettingGuide";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, DollarSign, PieChart, ArrowRight } from "lucide-react";
import { AddBudgetDialog } from "@/components/budget/AddBudgetDialog";
import { useState } from "react";
import type { NoBudgetProps } from "@/types/types";

export const NoBudget: React.FC<NoBudgetProps> = ({ budgets, setBudgets }) => {
  const [isBudgetGuideOpen, setisBudgetGuideOpen] = useState(false);

  return (
    <div className="w-11/12 md:w-10/12 lg:w-7/12 2xl:w-6/12 my-8 mx-auto flex flex-col space-y-7">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Your Budget Planner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Start managing your finances by creating your first budget 🙂
            </p>
            <p className="text-sm text-muted-foreground">
              Creating a budget helps you track your income and expenses,
              allowing you to make informed financial decisions.
            </p>
          </div>
          <AddBudgetDialog budgets={budgets} setBudgets={setBudgets}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First Budget
            </Button>
          </AddBudgetDialog>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Why Create a Budget?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Track your spending</span>
          </div>
          <div className="flex items-center">
            <PieChart className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Allocate funds to different categories
            </span>
          </div>
          <div className="flex items-center">
            <ArrowRight className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Work towards your financial goals</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Need Help Getting Started?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Check out our guide on creating an effective budget:
          </p>

          <Button
            variant="link"
            onClick={() => setisBudgetGuideOpen(true)}
            className="p-0"
          >
            Read Budget Guide <ArrowRight className="ml-2 h-4 w-4" />
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
