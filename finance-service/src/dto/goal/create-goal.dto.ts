export class CreateGoalDto {
    name: string;
    totalAmount: number;
    currentAmount: number;
    targetDate?: number;
    userId: string;
}
