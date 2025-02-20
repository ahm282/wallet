import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from "@nestjs/common";
import { GoalsService } from "./goals.service";
import { CreateGoalDto } from "../../dto/goal/create-goal.dto";
import { UpdateGoalDto } from "../../dto/goal/update-goal.dto";

@Controller("goals")
export class GoalsController {
    constructor(private readonly goalsService: GoalsService) {}

    @Post()
    create(@Body() createGoalDto: CreateGoalDto) {
        return this.goalsService.create(createGoalDto);
    }
    s;

    @Get()
    findAll() {
        return this.goalsService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.goalsService.findOne(id);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateGoalDto: UpdateGoalDto) {
        return this.goalsService.update(id, updateGoalDto);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        const result = await this.goalsService.remove(id);
        if (!result) {
            throw new NotFoundException(`Goal with id ${id} not found`);
        }
        return { code: 200, msg: "Goal deleted successfully" };
    }
}
