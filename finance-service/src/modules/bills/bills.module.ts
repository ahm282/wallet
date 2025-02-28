import { Module } from "@nestjs/common";
import { BillsService } from "./bills.service";
import { BillsController } from "./bills.controller";
import { Bill, BillSchema } from "@/schemas/bill.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { BillRepository } from "@/repositories/bill.repository";

@Module({
    imports: [MongooseModule.forFeature([{ name: Bill.name, schema: BillSchema }])],
    controllers: [BillsController],
    providers: [BillsService, BillRepository],
    exports: [BillsService, BillRepository],
})
export class BillsModule {}
