import { Injectable } from "@nestjs/common";
import { CreateGoalDto } from "../../dto/goal/create-goal.dto";
import { UpdateGoalDto } from "../../dto/goal/update-goal.dto";
import { Goal } from "../../schemas/goal.schema";
import { Model, Connection } from "mongoose";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { toUnixTimestamp } from "@/lib/utils";

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

        // Change the date to a Unix timestamp
        createdGoal.targetDate = toUnixTimestamp(createdGoal.targetDate);

        await createdGoal.save();
        await session.commitTransaction();
        session.endSession();

        return createdGoal;
    }

    async findAll(): Promise<Goal[]> {
        let all_goals = await this.goalModel.find().exec();
        return all_goals;
    }

    async findAllByUserId(userId: string): Promise<Goal[]> {
        let all_goals = await this.goalModel.find({ userId: userId }).exec();
        return all_goals;
    }

    async findOne(id: string) {
        return this.goalModel.findById(id);
    }

    async update(id: string, updateGoalDto: UpdateGoalDto) {
        updateGoalDto.updatedAt = Math.floor(Date.now() / 1000);
        return this.goalModel.findByIdAndUpdate(id, updateGoalDto, { new: true, runValidators: true });
    }

    async remove(id: string) {
        return this.goalModel.findByIdAndDelete(id);
    }
}
