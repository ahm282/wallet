export class CreateGoalDto {
  title: string;
  description: string;
  totalAmount: number;
  currentAmount: number;
  dueDate?: number;
  userId: string;
}
