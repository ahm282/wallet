import { Injectable } from "@nestjs/common";
import { CreateBillDto } from "../../dto/bill/create-bill.dto";
import { UpdateBillDto } from "../../dto/bill/update-bill.dto";

@Injectable()
export class BillsService {
    create(createBillDto: CreateBillDto) {
        return "This action adds a new bill";
    }

    findAll() {
        return `This action returns all bills`;
    }

    findOne(id: number) {
        return `This action returns a #${id} bill`;
    }

    update(id: number, updateBillDto: UpdateBillDto) {
        return `This action updates a #${id} bill`;
    }

    remove(id: number) {
        return `This action removes a #${id} bill`;
    }
}
