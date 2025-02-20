import { Transaction } from "@/schemas/transaction.schema";
import { IRepository } from "@/interfaces/generic.interface";

export interface ITransactionRepository extends IRepository<Transaction> {
    findByUserId(userId: string): Promise<Transaction[]>;
}
