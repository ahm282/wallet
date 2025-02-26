import { Controller, Get, Post, Body, Patch, Delete, NotFoundException, Query } from "@nestjs/common";
import { GoalsService } from "./goals.service";
import { CreateGoalDto } from "../../dto/goal/create-goal.dto";
import { UpdateGoalDto } from "../../dto/goal/update-goal.dto";

@Controller("/goal")
export class GoalsController {
    constructor(private readonly goalsService: GoalsService) {}

    @Post()
    create(@Body() createGoalDto: CreateGoalDto) {
        return this.goalsService.create(createGoalDto);
    }

    @Get()
    findAllByUserId(@Query("id") id: string) {
        return this.goalsService.findAllByUserId(id);
    }

    @Patch()
    update(@Query("id") id: string, @Body() updateGoalDto: UpdateGoalDto) {
        return this.goalsService.update(id, updateGoalDto);
    }

    @Delete()
    async remove(@Query("id") id: string) {
        const result = await this.goalsService.remove(id);
        if (!result) {
            throw new NotFoundException(`Goal with id ${id} not found`);
        }
        return { code: 200, msg: "Goal deleted successfully!" };
    }
}
