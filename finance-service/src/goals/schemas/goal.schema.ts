import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GoalDocument = HydratedDocument<Goal>;

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Goal {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  currentAmount: number;

  @Virtual({
    get: function (this: Goal) {
      return this.totalAmount === this.currentAmount ? 1 : 0;
    },
  })
  status: number;

  @Prop({
    type: Number,
    required: true,
    set: toUnixTimestamp,
    get: (value: number): number => value,
  })
  dueDate: number;

  @Prop({ required: true })
  userId: string;

  @Prop({
    type: Number,
    required: true,
    set: toUnixTimestamp,
    get: (value: number): number => value,
  })
  createdAt: number;

  @Prop({
    type: Number,
    required: true,
    set: toUnixTimestamp,
    get: (value: number): number => value,
  })
  updatedAt: number;
}

function toUnixTimestamp(value: Date | string | number): number {
  if (typeof value === 'number') return value;
  if (value instanceof Date) return Math.floor(value.getTime() / 1000);
  return Math.floor(new Date(value).getTime() / 1000);
}

export const GoalSchema = SchemaFactory.createForClass(Goal);
