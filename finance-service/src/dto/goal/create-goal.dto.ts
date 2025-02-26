export class CreateGoalDto {
    name: string;
    totalAmount: number;
    currentAmount: number;
    targetDate?: string | number;
    userId: string;
}
