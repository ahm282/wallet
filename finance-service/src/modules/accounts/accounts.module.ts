import { Module } from "@nestjs/common";
import { AccountsService } from "./accounts.service";
import { AccountsController } from "./accounts.controller";
import { AccountRepository } from "@/repositories/account.repository";
import { Account, AccountSchema } from "@/schemas/account.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }])],
    controllers: [AccountsController],
    providers: [AccountsService, AccountRepository],
    exports: [AccountsService, AccountRepository],
})
export class AccountsModule {}
