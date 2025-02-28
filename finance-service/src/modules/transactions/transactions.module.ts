import { Module } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { TransactionsController } from "./transactions.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Transaction, TransactionSchema } from "@/schemas/transaction.schema";
import { TransactionRepository } from "@/repositories/transaction.repository";

@Module({
    imports: [MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }])],
    controllers: [TransactionsController],
    providers: [TransactionsService, TransactionRepository],
    exports: [TransactionsService, TransactionRepository],
})
export class TransactionsModule {}
