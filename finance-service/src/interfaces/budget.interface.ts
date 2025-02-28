import { Budget } from "@/schemas/budget.schema";
import { IRepository } from "@/interfaces/generic.interface";

export interface IBudgetRepository extends IRepository<Budget> {
    findByUserId(userId: string): Promise<Budget[]>;
}
