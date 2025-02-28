import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { BudgetsService } from "./budgets.service";
import { CreateBudgetDto } from "../../dto/budget/create-budget.dto";
import { UpdateBudgetDto } from "../../dto/budget/update-budget.dto";

@Controller("budget")
export class BudgetsController {
    constructor(private readonly budgetsService: BudgetsService) {}

    @Post()
    create(@Body() createBudgetDto: CreateBudgetDto) {
        return this.budgetsService.create(createBudgetDto);
    }

    @Get(":budgetId")
    findById(@Param("budgetId") id: string) {
        return this.budgetsService.findById(id);
    }

    @Get()
    findAllByUserId(@Query("id") id: string) {
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
