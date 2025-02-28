import { Controller, Post, Body, Get, Delete, Query, Patch, Param, HttpCode, HttpStatus } from "@nestjs/common";
import { AccountsService } from "./accounts.service";
import { CreateAccountDto } from "@/dto/account/create-account.dto";
import { UpdateAccountDto } from "@/dto/account/update-account.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Account")
@Controller("account")
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) {}

    @Post()
    @ApiOperation({
        summary: "Create a new account",
        requestBody: {
            description: "Account creation payload",
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/CreateAccountDto" },
                },
            },
        },
    })
    create(@Body() createAccountDto: CreateAccountDto) {
        return this.accountsService.create(createAccountDto);
    }

    @Get(":accountId")
    @ApiOperation({ summary: "Find account by id", parameters: [{ name: "id", in: "path", required: true }] })
    findById(@Param("accountId") id: string) {
        return this.accountsService.findById(id);
    }

    @Get()
    @ApiOperation({
        summary: "Find all accounts by user id",
        parameters: [{ name: "id", in: "query", required: true }],
    })
    findAllByUserId(@Query("id") id: string) {
        return this.accountsService.findAllByUserId(id);
    }

    @Patch()
    @ApiOperation({
        summary: "Update account by id",
        parameters: [{ name: "id", in: "query", required: true }],
        requestBody: {
            description: "Account update payload",
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/UpdateAccountDto" },
                },
            },
        },
    })
    async update(@Query("id") id: string, @Body() updateAccountDto: UpdateAccountDto) {
        return this.accountsService.update(id, updateAccountDto);
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: "Remove account by id",
        parameters: [{ name: "id", in: "query", required: true }],
    })
    async remove(@Query("id") id: string) {
        return this.accountsService.delete(id);
    }
}
