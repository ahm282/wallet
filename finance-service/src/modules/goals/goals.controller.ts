import { Controller, Get, Post, Body, Patch, Delete, Query, HttpCode, HttpStatus } from "@nestjs/common";
import { GoalsService } from "./goals.service";
import { CreateGoalDto } from "../../dto/goal/create-goal.dto";
import { UpdateGoalDto } from "../../dto/goal/update-goal.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("goal")
@Controller("goal")
export class GoalsController {
    constructor(private readonly goalsService: GoalsService) {}

    @Post()
    @ApiOperation({
        summary: "Create a goal",
        requestBody: {
            description: "Goal creation payload",
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/CreateGoalDto" },
                },
            },
        },
    })
    async create(@Body() createGoalDto: CreateGoalDto) {
        return this.goalsService.create(createGoalDto);
    }

    @Get(":goalId")
    @ApiOperation({ summary: "Find a goal by id", parameters: [{ name: "goalId", in: "path", required: true }] })
    async findById(@Query("id") id: string) {
        return this.goalsService.findById(id);
    }

    @Get()
    @ApiOperation({ summary: "Find all goals for a user", parameters: [{ name: "id", in: "query", required: true }] })
    async findAllByUserId(@Query("id") id: string) {
        return this.goalsService.findAllByUserId(id);
    }

    @Patch()
    @ApiOperation({ summary: "Update a goal", parameters: [{ name: "id", in: "query", required: true }] })
    async update(@Query("id") id: string, @Body() updateGoalDto: UpdateGoalDto) {
        return this.goalsService.update(id, updateGoalDto);
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Delete a goal", parameters: [{ name: "id", in: "query", required: true }] })
    async remove(@Query("id") id: string) {
        return this.goalsService.delete(id);
    }
}
