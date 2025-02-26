import { Injectable } from "@nestjs/common";
import { AccountRepository } from "@/repositories/account.repository";
import { CreateAccountDto } from "@/dto/account/create-account.dto";
import { UpdateAccountDto } from "@/dto/account/update-account.dto";

@Injectable()
export class AccountsService {
    constructor(private readonly accountRepo: AccountRepository) {}

    async createAccount(createAccountDto: CreateAccountDto) {
        return await this.accountRepo.create(createAccountDto);
    }

    async findById(id: string) {
        return await this.accountRepo.findById(id);
    }

    async findAllByUserId(userId: string) {
        return await this.accountRepo.findByUserId(userId);
    }

    async updateAccount(id: string, updateAccountDto: UpdateAccountDto) {
        return await this.accountRepo.update(id, updateAccountDto);
    }

    async deleteAccount(id: string) {
        return await this.accountRepo.delete(id);
    }
}
