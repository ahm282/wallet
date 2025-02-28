import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { BillsService } from "./bills.service";
import { CreateBillDto } from "../../dto/bill/create-bill.dto";
import { UpdateBillDto } from "../../dto/bill/update-bill.dto";

@Controller("bill")
export class BillsController {
    constructor(private readonly billsService: BillsService) {}

    @Post()
    async create(@Body() createBillDto: CreateBillDto) {
        return this.billsService.create(createBillDto);
    }

    @Get(":id")
    async findById(@Param("id") id: string) {
        return this.billsService.findById(id);
    }

    @Get()
    async findAllByUserId(@Query("id") id: string) {
        return this.billsService.findAllByUserId(id);
    }

    @Patch()
    async update(@Query("id") id: string, @Body() updateBillDto: UpdateBillDto) {
        return this.billsService.update(id, updateBillDto);
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Query("id") id: string) {
        return this.billsService.delete(id);
    }

    @Patch("pay")
    async pay(@Query("id") id: string) {
        return this.billsService.pay(id);
    }
}
