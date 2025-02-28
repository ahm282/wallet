import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Account, AccountDocument } from "../schemas/account.schema";
import { GenericRepository } from "@/repositories/generic.repository";
import { IAccountRepository } from "@/interfaces/account.interface";

@Injectable()
export class AccountRepository extends GenericRepository<AccountDocument> implements IAccountRepository {
    constructor(@InjectModel(Account.name) private accountModel: Model<AccountDocument>) {
        super(accountModel);
    }

    async findByUserId(userId: string): Promise<AccountDocument[]> {
        return this.accountModel.find({ userId }).exec();
    }
}
