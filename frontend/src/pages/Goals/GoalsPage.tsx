import { useState } from "react";
import { NoGoals } from "@/components/goals/NoGoals";
import { GoalsDataExists } from "@/components/goals/GoalsDataExists";
import type { Goal } from "@/types/goals.types";

export const GoalsPage = () => {
  // Sample data
  const sampleGoals = [
    {
      id: 1,
      name: "Emergency fund",
      target: 1000,
      current: 500,
      targetDate: "2022-12-31",
    },
    {
      id: 2,
      name: "Vacation",
      target: 2000,
      current: 1000,
      targetDate: "2023-06-30",
    },
    {
      id: 3,
      name: "New car",
      target: 15000,
      current: 5000,
      targetDate: "2024-12-31",
    },
    {
      id: 4,
      name: "New house",
      target: 200000,
      current: 20000,
      targetDate: "2026-12-31",
    },
    {
      id: 5,
      name: "New computer",
      target: 2000,
      current: 200,
      targetDate: "2023-12-31",
    },
  ];

  const [goals, setGoals] = useState<Goal[]>(sampleGoals);
  const hasGoalData = goals.length > 0;

  return hasGoalData ? (
    <GoalsDataExists goals={goals} setGoals={setGoals} />
  ) : (
    <NoGoals goals={goals} setGoals={setGoals} />
  );
};

export default GoalsPage;
