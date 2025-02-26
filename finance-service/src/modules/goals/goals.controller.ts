import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Delete,
    NotFoundException,
    Query,
    HttpCode,
    HttpStatus,
} from "@nestjs/common";
import { GoalsService } from "./goals.service";
import { CreateGoalDto } from "../../dto/goal/create-goal.dto";
import { UpdateGoalDto } from "../../dto/goal/update-goal.dto";

@Controller("goal")
export class GoalsController {
    constructor(private readonly goalsService: GoalsService) {}

    @Post()
    create(@Body() createGoalDto: CreateGoalDto) {
        return this.goalsService.create(createGoalDto);
    }

    @Get(":goalId")
    findOne(@Query("id") id: string) {
        const goal = this.goalsService.findOne(id);

        if (!goal) {
            throw new NotFoundException("Goal not found");
        }

        return goal;
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
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Query("id") id: string) {
        return this.goalsService.delete(id);
    }
}
