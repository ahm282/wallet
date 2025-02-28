import { ApiProperty } from "@nestjs/swagger";

export class CreateBillDto {
    @ApiProperty()
    payee: string;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    dueDate: number;

    @ApiProperty()
    paidOn?: number;

    @ApiProperty()
    paid?: boolean;

    @ApiProperty()
    description?: string;

    @ApiProperty()
    recurring?: boolean;

    @ApiProperty()
    userId: string;
}
