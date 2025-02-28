import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { BudgetsService } from "./budgets.service";
import { CreateBudgetDto } from "../../dto/budget/create-budget.dto";
import { UpdateBudgetDto } from "../../dto/budget/update-budget.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("budget")
@Controller("budget")
export class BudgetsController {
    constructor(private readonly budgetsService: BudgetsService) {}

    @Post()
    @ApiOperation({
        summary: "Create a budget",
        requestBody: {
            description: "Budget creation payload",
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/CreateBudgetDto" },
                },
            },
        },
    })
    async create(@Body() createBudgetDto: CreateBudgetDto) {
        return this.budgetsService.create(createBudgetDto);
    }

    @Get(":budgetId")
    @ApiOperation({ summary: "Find a budget by id", parameters: [{ name: "budgetId", in: "path", required: true }] })
    async findById(@Param("budgetId") id: string) {
        return this.budgetsService.findById(id);
    }

    @Get()
    @ApiOperation({ summary: "Find all budgets for a user", parameters: [{ name: "id", in: "query", required: true }] })
    async findAllByUserId(@Query("id") id: string) {
        return this.budgetsService.findAllByUserId(id);
    }

    @Patch()
    @ApiOperation({ summary: "Update a budget", parameters: [{ name: "id", in: "query", required: true }] })
    async update(@Query("id") id: string, @Body() updateBudgetDto: UpdateBudgetDto) {
        return this.budgetsService.update(id, updateBudgetDto);
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Delete a budget", parameters: [{ name: "id", in: "query", required: true }] })
    async remove(@Query("id") id: string) {
        return this.budgetsService.delete(id);
    }
}
