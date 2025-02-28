import { Injectable } from "@nestjs/common";
import { CreateBillDto } from "../../dto/bill/create-bill.dto";
import { UpdateBillDto } from "../../dto/bill/update-bill.dto";
import { BillRepository } from "@/repositories/bill.repository";

@Injectable()
export class BillsService {
    constructor(private readonly billRepo: BillRepository) {}

    async create(createBillDto: CreateBillDto) {
        return this.billRepo.create(createBillDto);
    }

    async findById(id: string) {
        return this.billRepo.findById(id);
    }

    async findAllByUserId(id: string) {
        return this.billRepo.findAllByUserId(id);
    }

    async update(id: string, updateBillDto: UpdateBillDto) {
        return this.billRepo.update(id, updateBillDto);
    }

    async delete(id: string) {
        return this.billRepo.delete(id);
    }

    async pay(id: string) {
        return this.billRepo.pay(id);
    }
}
