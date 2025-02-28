import { Injectable } from "@nestjs/common";
import { stringToCategory } from "@/lib/utils";
import { CreateTransactionDto } from "../../dto/transaction/create-transaction.dto";
import { UpdateTransactionDto } from "../../dto/transaction/update-transaction.dto";
import { TransactionRepository } from "@/repositories/transaction.repository";

@Injectable()
export class TransactionsService {
    constructor(private readonly transactionRepo: TransactionRepository) {}

    async create(createTransactionDto: CreateTransactionDto) {
        createTransactionDto.category = stringToCategory(
            createTransactionDto.category ? createTransactionDto.category : "other"
        );
        return await this.transactionRepo.create(createTransactionDto);
    }

    async findById(id: string) {
        return this.transactionRepo.findById(id);
    }

    async findAllByUserId(userId: string) {
        return this.transactionRepo.findByUserId(userId);
    }

    async update(id: string, updateTransactionDto: UpdateTransactionDto) {
        updateTransactionDto.category = stringToCategory(
            updateTransactionDto.category ? updateTransactionDto.category : "other"
        );
        return this.transactionRepo.update(id, updateTransactionDto);
    }

    async delete(id: string) {
        return this.transactionRepo.delete(id);
    }
}
