import { ApiProperty } from "@nestjs/swagger";

export class CreateGoalDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    targetAmount: number;

    @ApiProperty()
    currentAmount: number;

    @ApiProperty()
    targetDate?: number;

    @ApiProperty()
    userId: string;
}
