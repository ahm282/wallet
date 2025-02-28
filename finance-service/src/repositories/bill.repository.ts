import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Bill, BillDocument } from "@/schemas/bill.schema";
import { GenericRepository } from "@/repositories/generic.repository";
import { IBillRepository } from "@/interfaces/bill.interface";

@Injectable()
export class BillRepository extends GenericRepository<BillDocument> implements IBillRepository {
    constructor(@InjectModel(Bill.name) private billModel: Model<BillDocument>) {
        super(billModel);
    }

    async findByUserId(userId: string): Promise<BillDocument[]> {
        return this.model.find({ userId }).exec();
    }

    async findUpcomingUnpaid(userId: string, now: Date): Promise<BillDocument[]> {
        return this.model
            .find({
                userId,
                paid: false,
                dueDate: { $gte: now },
            })
            .exec();
    }

    async pay(id: string): Promise<BillDocument | null> {
        const paidOn = new Date().getTime();
        return this.model.findByIdAndUpdate(id, { paid: true, paidOn: paidOn }, { new: true }).exec();
    }
}
