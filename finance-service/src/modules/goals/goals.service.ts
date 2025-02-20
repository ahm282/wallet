import { Injectable } from "@nestjs/common";
import { CreateGoalDto } from "../../dto/goal/create-goal.dto";
import { UpdateGoalDto } from "../../dto/goal/update-goal.dto";
import { Goal } from "../../schemas/goal.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";

@Injectable()
export class GoalsService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        @InjectModel(Goal.name) private goalModel: Model<Goal>
    ) {}

    async create(createGoalDto: CreateGoalDto): Promise<Goal> {
        const session = await this.connection.startSession();
        session.startTransaction();

        const createdGoal = new this.goalModel(createGoalDto);
        const now = Math.floor(Date.now() / 1000);
        createdGoal.createdAt = now;
        createdGoal.updatedAt = now;

        await createdGoal.save();
        await session.commitTransaction();
        session.endSession();

        return createdGoal;
    }

    async findAll(): Promise<Goal[]> {
        console.log("Request received to find all goals!");
        let all_goals = await this.goalModel.find().exec();
        await console.log(all_goals);
        return all_goals;
    }

    findOne(id: string) {
        return this.goalModel.findById(id);
    }

    update(id: string, updateGoalDto: UpdateGoalDto) {
        return this.goalModel.findByIdAndUpdate(id, updateGoalDto);
    }

    remove(id: string) {
        return this.goalModel.findByIdAndDelete(id);
    }
}
