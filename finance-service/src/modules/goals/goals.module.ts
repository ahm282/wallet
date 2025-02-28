import { Module } from "@nestjs/common";
import { GoalsService } from "./goals.service";
import { GoalsController } from "./goals.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Goal, GoalSchema } from "@/schemas/goal.schema";
import { GoalRepository } from "@/repositories/goal.repository";

@Module({
    imports: [MongooseModule.forFeature([{ name: Goal.name, schema: GoalSchema }])],
    controllers: [GoalsController],
    providers: [GoalsService, GoalRepository],
    exports: [GoalsService, GoalRepository],
})
export class GoalsModule {}
