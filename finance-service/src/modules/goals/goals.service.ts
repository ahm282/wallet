import { Injectable } from "@nestjs/common";
import { CreateGoalDto } from "../../dto/goal/create-goal.dto";
import { UpdateGoalDto } from "../../dto/goal/update-goal.dto";
import { GoalRepository } from "@/repositories/goal.repository";

@Injectable()
export class GoalsService {
    constructor(private readonly goalRepo: GoalRepository) {}

    async create(createGoalDto: CreateGoalDto) {
        return await this.goalRepo.create(createGoalDto);
    }

    async findById(id: string) {
        return this.goalRepo.findById(id);
    }

    async findAllByUserId(userId: string) {
        return await this.goalRepo.findByUserId(userId);
    }

    async update(id: string, updateGoalDto: UpdateGoalDto) {
        return this.goalRepo.update(id, updateGoalDto);
    }

    async delete(id: string) {
        return this.goalRepo.delete(id);
    }
}
