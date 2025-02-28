import { Module } from "@nestjs/common";
import { BudgetsService } from "./budgets.service";
import { BudgetsController } from "./budgets.controller";
import { Budget, BudgetSchema } from "@/schemas/budget.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { BudgetRepository } from "@/repositories/budget.repository";

@Module({
    imports: [MongooseModule.forFeature([{ name: Budget.name, schema: BudgetSchema }])],
    controllers: [BudgetsController],
    providers: [BudgetsService, BudgetRepository],
    exports: [BudgetsService, BudgetRepository],
})
export class BudgetsModule {}
