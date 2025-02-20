import { Goal } from "@/schemas/goal.schema";
import { IRepository } from "@/interfaces/generic.interface";

export interface IGoalRepository extends IRepository<Goal> {
    findByUserId(userId: string): Promise<Goal[]>;
}
