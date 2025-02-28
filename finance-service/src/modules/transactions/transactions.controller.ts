import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "../../dto/transaction/create-transaction.dto";
import { UpdateTransactionDto } from "../../dto/transaction/update-transaction.dto";

@Controller("transactions")
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @Post()
    async create(@Body() createTransactionDto: CreateTransactionDto) {
        return this.transactionsService.create(createTransactionDto);
    }

    @Get(":transactionId")
    async findById(@Param("id") id: string) {
        return this.transactionsService.findById(id);
    }

    @Get()
    async findAllByUserId(@Query("id") id: string) {
        return this.transactionsService.findAllByUserId(id);
    }

    @Patch()
    async update(@Query("id") id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
        return this.transactionsService.update(id, updateTransactionDto);
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Query("id") id: string) {
        return this.transactionsService.delete(id);
    }
}
