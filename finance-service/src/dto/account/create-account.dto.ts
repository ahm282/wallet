import { ApiProperty } from "@nestjs/swagger";

export class CreateAccountDto {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    balance: number;

    @ApiProperty()
    institution: string;

    @ApiProperty()
    currency: string;
}
