// src/finance/modules/accounts/accounts.controller.ts
import { Controller, Post, Body, Get, Param, Put, Delete } from "@nestjs/common";
import { AccountsService } from "./accounts.service";
import { CreateAccountDto } from "@/dto/account/create-account.dto";
import { UpdateAccountDto } from "@/dto/account/update-account.dto";

@Controller("accounts")
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) {}

    @Post()
    async create(@Body() createAccountDto: CreateAccountDto) {
        // For testing, use a fixed userId (in a real app, extract from auth token)
        const userId = "testUser";
        return this.accountsService.createAccount(createAccountDto, userId);
    }

    @Get()
    async findAll() {
        return this.accountsService.getAccountsForUser("testUser");
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return this.accountsService.getAccountById(id);
    }

    @Put(":id")
    async update(@Param("id") id: string, @Body() updateAccountDto: UpdateAccountDto) {
        return this.accountsService.updateAccount(id, updateAccountDto);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return this.accountsService.deleteAccount(id);
    }
}
