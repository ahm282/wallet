import { Injectable } from "@nestjs/common";
import { AccountRepository } from "@/repositories/account.repository";
import { CreateAccountDto } from "@/dto/account/create-account.dto";
import { UpdateAccountDto } from "@/dto/account/update-account.dto";
import { Account } from "@/schemas/account.schema";

@Injectable()
export class AccountsService {
    constructor(private readonly accountRepo: AccountRepository) {}

    async createAccount(dto: CreateAccountDto, userId: string): Promise<Account> {
        return this.accountRepo.create({ ...dto, userId });
    }

    async getAccountById(id: string): Promise<Account | null> {
        return this.accountRepo.findById(id);
    }

    async getAccountsForUser(userId: string): Promise<Account[]> {
        return this.accountRepo.findByUserId(userId);
    }

    async updateAccount(id: string, dto: UpdateAccountDto): Promise<Account | null> {
        return this.accountRepo.update(id, dto);
    }

    async deleteAccount(id: string): Promise<boolean | null> {
        return !!this.accountRepo.delete(id);
    }
}
