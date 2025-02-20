import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Goal, GoalDocument } from "@/schemas/goal.schema";
import { GenericRepository } from "@/repositories/generic.repository";
import { IGoalRepository } from "@/interfaces/goal.interface";

@Injectable()
export class GoalRepository extends GenericRepository<GoalDocument> implements IGoalRepository {
    constructor(@InjectModel(Goal.name) private goalModel: Model<GoalDocument>) {
        super(goalModel);
    }

    async findByUserId(userId: string): Promise<GoalDocument[]> {
        return this.model.find({ userId }).exec();
    }
}
