import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { DatabaseConfig } from "./config/database.config";
import { AppService } from "./app.service";
import { GoalsModule } from "./modules/goals/goals.module";
import { BillsModule } from "./modules/bills/bills.module";
import { AccountsModule } from "./modules/accounts/accounts.module";
import { TransactionsModule } from "./modules/transactions/transactions.module";
import { BudgetsModule } from "./modules/budgets/budgets.module";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration.config";

@Module({
    imports: [
        DatabaseConfig.module,
        AccountsModule,
        BudgetsModule,
        BillsModule,
        GoalsModule,
        TransactionsModule,
        ConfigModule.forRoot({
            load: [configuration],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
