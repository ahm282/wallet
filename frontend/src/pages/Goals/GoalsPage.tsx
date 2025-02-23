import { useState, useEffect } from "react";
import { NoGoals } from "@/components/goals/NoGoals";
import { GoalsDataExists } from "@/components/goals/GoalsDataExists";
import { instantiateAPI } from "@/lib/api_utils";
import { useAuthStore } from "@/store/authStore";
import type { Goal } from "@/types/goals.types";

function getGoalsDataByUserId(): Promise<Goal[]> {
    const { user, token } = useAuthStore.getState();
    const api = instantiateAPI("http://localhost:3000/api");
    return api.get<Goal[]>("/finance/goal?id=" + user?.id, token);
}

function createGoalFromResponse(goalResponse: any): Goal {
    return {
        _id: goalResponse._id,
        name: goalResponse.name,
        target: goalResponse.totalAmount,
        current: goalResponse.currentAmount,
        status: goalResponse.status,
        targetDate: goalResponse.targetDate,
    };
}

export const GoalsPage = () => {
    const [goals, setGoals] = useState<Goal[]>([]);

    useEffect(() => {
        getGoalsDataByUserId()
            .then((goals) => {
                goals = goals.map(createGoalFromResponse);
                console.log("Goals data fetched:", goals);
                setGoals(goals);
            })
            .catch((error) => {
                console.error("Error fetching goals data:", error);
            });
    }, []);

    const hasGoalData = goals.length > 0;

    /*
     * Sets the title of the page to "Goals | Wallet" when the component mounts
     */
    useEffect(() => {
        document.title = "Goals | Wallet";
    }, []);

    return hasGoalData ? (
        <GoalsDataExists
            goals={goals}
            setGoals={setGoals}
        />
    ) : (
        <NoGoals
            goals={goals}
            setGoals={setGoals}
        />
    );
};

export default GoalsPage;
