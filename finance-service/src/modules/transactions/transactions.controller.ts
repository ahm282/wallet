import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "../../dto/transaction/create-transaction.dto";
import { UpdateTransactionDto } from "../../dto/transaction/update-transaction.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("transaction")
@Controller("transaction")
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @Post()
    @ApiOperation({
        summary: "Create a new transaction",
        requestBody: {
            description: "Budget creation payload",
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/CreateTransactionDto" },
                },
            },
        },
    })
    async create(@Body() createTransactionDto: CreateTransactionDto) {
        return this.transactionsService.create(createTransactionDto);
    }

    @Get(":transactionId")
    @ApiOperation({
        summary: "Find a transaction by id",
        parameters: [{ name: "transactionId", in: "path", required: true }],
    })
    async findById(@Param("id") id: string) {
        return this.transactionsService.findById(id);
    }

    @Get()
    @ApiOperation({
        summary: "Find all transactions for a user",
        parameters: [{ name: "id", in: "query", required: true }],
    })
    async findAllByUserId(@Query("id") id: string) {
        return this.transactionsService.findAllByUserId(id);
    }

    @Patch()
    @ApiOperation({ summary: "Update a transaction", parameters: [{ name: "id", in: "query", required: true }] })
    async update(@Query("id") id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
        return this.transactionsService.update(id, updateTransactionDto);
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Delete a transaction", parameters: [{ name: "id", in: "query", required: true }] })
    async remove(@Query("id") id: string) {
        return this.transactionsService.delete(id);
    }
}
