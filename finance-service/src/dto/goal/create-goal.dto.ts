export class CreateGoalDto {
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate?: number;
    userId: string;
}
