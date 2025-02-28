import { ApiProperty } from "@nestjs/swagger";

export class CreateBudgetDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    budgeted: number;

    @ApiProperty()
    spent: number;

    @ApiProperty()
    userId: string;
}
