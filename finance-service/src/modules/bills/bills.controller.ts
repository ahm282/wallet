import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { BillsService } from "./bills.service";
import { CreateBillDto } from "../../dto/bill/create-bill.dto";
import { UpdateBillDto } from "../../dto/bill/update-bill.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("bill")
@Controller("bill")
export class BillsController {
    constructor(private readonly billsService: BillsService) {}

    @Post()
    @ApiOperation({
        summary: "Create a bill",
        requestBody: {
            description: "Bill creation payload",
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/CreateBillDto" } } },
        },
    })
    async create(@Body() createBillDto: CreateBillDto) {
        return this.billsService.create(createBillDto);
    }

    @Get(":id")
    @ApiOperation({ summary: "Find a bill by id", parameters: [{ name: "id", in: "path", required: true }] })
    async findById(@Param("id") id: string) {
        return this.billsService.findById(id);
    }

    @Get()
    @ApiOperation({ summary: "Find all bills for a user", parameters: [{ name: "id", in: "query", required: true }] })
    async findAllByUserId(@Query("id") id: string) {
        return this.billsService.findAllByUserId(id);
    }

    @Patch()
    @ApiOperation({ summary: "Update a bill", parameters: [{ name: "id", in: "query", required: true }] })
    async update(@Query("id") id: string, @Body() updateBillDto: UpdateBillDto) {
        return this.billsService.update(id, updateBillDto);
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Delete a bill", parameters: [{ name: "id", in: "query", required: true }] })
    async delete(@Query("id") id: string) {
        return this.billsService.delete(id);
    }

    @Patch("pay")
    @ApiOperation({ summary: "Mark a bill as paid", parameters: [{ name: "id", in: "query", required: true }] })
    async pay(@Query("id") id: string) {
        return this.billsService.pay(id);
    }
}
