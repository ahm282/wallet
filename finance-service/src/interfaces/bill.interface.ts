import { Bill } from "@/schemas/bill.schema";
import { IRepository } from "@/interfaces/generic.interface";

export interface IBillRepository extends IRepository<Bill> {
    findByUserId(userId: string): Promise<Bill[]>;
    findUpcomingUnpaid(userId: string, now: Date): Promise<Bill[]>;
}
