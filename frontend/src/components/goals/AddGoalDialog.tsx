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
import { Plus } from "lucide-react";
import { useState } from "react";
import { validateGoalForm } from "@/lib/validations/validate_goal_form";
import type { AddGoalDialogProps } from "@/types/goals.types";

export const AddGoalDialog: React.FC<AddGoalDialogProps> = ({
  goals,
  setGoals,
}) => {
  const [newGoal, setNewGoal] = useState({
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

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors } = validateGoalForm(newGoal);
    setErrors(errors);

    if (isValid) {
      setGoals([
        ...goals,
        {
          id: goals.length + 1,
          name: newGoal.name,
          target: Number.parseFloat(newGoal.target),
          current: newGoal.current ? Number.parseFloat(newGoal.current) : 0,
          targetDate: newGoal.targetDate,
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
        <Plus className="mr-2 size-4" /> Add a Goal
      </Button>
      <Credenza open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <CredenzaContent className="sm:max-w-[425px]">
          <CredenzaHeader>
            <CredenzaTitle>Add New Goal</CredenzaTitle>
            <CredenzaDescription>
              Create a new financial goal to track your progress
            </CredenzaDescription>
          </CredenzaHeader>
          <form onSubmit={handleAddGoal}>
            <div className="w-11/12 grid gap-4 py-4">
              {/* Name Field */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <div className="col-span-3">
                  <Input
                    id="name"
                    value={newGoal.name}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, name: e.target.value })
                    }
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                  )}
                </div>
              </div>
              {/* Target Field */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="target" className="text-right">
                  Target
                </Label>
                <div className="col-span-3">
                  <Input
                    id="target"
                    type="text"
                    value={newGoal.target}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, target: e.target.value })
                    }
                  />
                  {errors.target && (
                    <p className="text-xs text-red-500">{errors.target}</p>
                  )}
                </div>
              </div>
              {/* Current Field */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="current" className="text-right">
                  Current
                </Label>
                <div className="col-span-3">
                  <Input
                    id="current"
                    type="text"
                    value={newGoal.current}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, current: e.target.value })
                    }
                  />
                  {errors.current && (
                    <p className="text-xs text-red-500">{errors.current}</p>
                  )}
                </div>
              </div>
              {/* Target Date Field */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="targetDate" className="text-right">
                  Target Date
                </Label>
                <div className="col-span-3">
                  <Input
                    id="targetDate"
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, targetDate: e.target.value })
                    }
                  />
                  {errors.targetDate && (
                    <p className="text-xs text-red-500">{errors.targetDate}</p>
                  )}
                </div>
              </div>
            </div>
            <CredenzaFooter className="w-11/12 mx-auto">
              <Button type="submit">
                <Plus className="mr-2 size-4" /> Add Goal
              </Button>
              <CredenzaClose asChild>
                <Button variant="outline">Cancel</Button>
              </CredenzaClose>
            </CredenzaFooter>
          </form>
        </CredenzaContent>
      </Credenza>
    </>
  );
};

export default AddGoalDialog;
