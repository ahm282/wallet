import Category from "@/enums/category.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTransactionDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    date: number;

    @ApiProperty()
    description?: string;

    @ApiProperty()
    category: Category | string;

    @ApiProperty()
    userId: string;
}
