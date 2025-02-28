import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Transaction, TransactionDocument } from "../schemas/transaction.schema";
import { GenericRepository } from "./generic.repository";
import { ITransactionRepository } from "@/interfaces/transaction.interface";

@Injectable()
export class TransactionRepository extends GenericRepository<TransactionDocument> implements ITransactionRepository {
    constructor(@InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>) {
        super(transactionModel);
    }

    async findByUserId(userId: string): Promise<TransactionDocument[]> {
        return this.model.find({ userId }).exec();
    }
}
