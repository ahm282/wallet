import { Controller, Post, Body, Get, Delete, Query, Patch, Param, HttpCode, HttpStatus } from "@nestjs/common";
import { AccountsService } from "./accounts.service";
import { CreateAccountDto } from "@/dto/account/create-account.dto";
import { UpdateAccountDto } from "@/dto/account/update-account.dto";

@Controller("account")
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) {}

    @Post()
    create(@Body() createAccountDto: CreateAccountDto) {
        return this.accountsService.createAccount(createAccountDto);
    }

    @Get(":accountId")
    findOne(@Param("accountId") id: string) {
        return this.accountsService.findById(id);
    }

    @Get()
    findAllByUserId(@Query("id") id: string) {
        return this.accountsService.findAllByUserId(id);
    }

    @Patch()
    async update(@Query("id") id: string, @Body() updateAccountDto: UpdateAccountDto) {
        return this.accountsService.updateAccount(id, updateAccountDto);
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Query("id") id: string) {
        return this.accountsService.deleteAccount(id);
    }
}
