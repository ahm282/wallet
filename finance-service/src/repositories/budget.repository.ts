import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Budget, BudgetDocument } from "@/schemas/budget.schema";
import { GenericRepository } from "@/repositories/generic.repository";
import { IBudgetRepository } from "@/interfaces/budget.interface";

@Injectable()
export class BudgetRepository extends GenericRepository<BudgetDocument> implements IBudgetRepository {
    constructor(@InjectModel(Budget.name) private budgetModel: Model<BudgetDocument>) {
        super(budgetModel);
    }

    async findByUserId(userId: string): Promise<BudgetDocument[]> {
        return this.model.find({ userId }).exec();
    }
}
