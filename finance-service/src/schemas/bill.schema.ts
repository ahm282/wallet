import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export enum RecurrenceFrequency {
    Daily = "daily",
    Weekly = "weekly",
    Monthly = "monthly",
    Yearly = "yearly",
}

@Schema({ _id: false })
export class Recurrence {
    @Prop({ required: true, enum: RecurrenceFrequency })
    frequency: RecurrenceFrequency;

    @Prop({ default: 1 })
    interval: number;

    @Prop()
    endDate?: Date;
}
export const RecurrenceSchema = SchemaFactory.createForClass(Recurrence);

export type BillDocument = HydratedDocument<Bill>;

@Schema({ timestamps: true })
export class Bill {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    payee: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    dueDate: Date;

    @Prop()
    paidOn?: Date;

    @Prop({ default: false })
    paid: boolean;

    @Prop()
    description?: string;

    @Prop({ default: false })
    recurring: boolean;

    @Prop({ type: RecurrenceSchema })
    recurrence?: Recurrence;

    @Prop({ type: Object, default: {} })
    metadata: Record<string, any>;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
