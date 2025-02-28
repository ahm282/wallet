import { Injectable } from "@nestjs/common";
import { CreateBudgetDto } from "../../dto/budget/create-budget.dto";
import { UpdateBudgetDto } from "../../dto/budget/update-budget.dto";
import { BudgetRepository } from "@/repositories/budget.repository";

@Injectable()
export class BudgetsService {
    constructor(private readonly budgetRepo: BudgetRepository) {}

    async create(createBudgetDto: CreateBudgetDto) {
        return this.budgetRepo.create(createBudgetDto);
    }

    async findById(id: string) {
        return this.budgetRepo.findById(id);
    }

    async findAllByUserId(id: string) {
        return this.budgetRepo.findAllByUserId(id);
    }

    async update(id: string, updateBudgetDto: UpdateBudgetDto) {
        return this.budgetRepo.update(id, updateBudgetDto);
    }

    async delete(id: string) {
        return this.budgetRepo.delete(id);
    }
}
