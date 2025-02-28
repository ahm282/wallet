import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { BudgetsService } from "./budgets.service";
import { CreateBudgetDto } from "../../dto/budget/create-budget.dto";
import { UpdateBudgetDto } from "../../dto/budget/update-budget.dto";

@Controller("budget")
export class BudgetsController {
    constructor(private readonly budgetsService: BudgetsService) {}

    @Post()
    async create(@Body() createBudgetDto: CreateBudgetDto) {
        return this.budgetsService.create(createBudgetDto);
    }

    @Get(":budgetId")
    async findById(@Param("budgetId") id: string) {
        return this.budgetsService.findById(id);
    }

    @Get()
    async findAllByUserId(@Query("id") id: string) {
        return this.budgetsService.findAllByUserId(id);
    }

    @Patch()
    async update(@Query("id") id: string, @Body() updateBudgetDto: UpdateBudgetDto) {
        return this.budgetsService.update(id, updateBudgetDto);
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Query("id") id: string) {
        return this.budgetsService.delete(id);
    }
}
