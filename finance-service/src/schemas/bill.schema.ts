import { toUnixTimestamp } from "@/lib/utils";
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
    @Prop({ required: true, enum: RecurrenceFrequency, default: RecurrenceFrequency.Monthly })
    frequency: RecurrenceFrequency;

    @Prop({ default: 1 })
    interval: number;

    @Prop()
    endDate?: Date;
}
export const RecurrenceSchema = SchemaFactory.createForClass(Recurrence);

export type BillDocument = HydratedDocument<Bill>;

@Schema({
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret._id;
            return ret;
        },
    },
    toObject: { virtuals: true },
})
export class Bill {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    payee: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    dueDate: number;

    @Prop({ required: false })
    paidOn?: number;

    @Prop({ default: false })
    paid: boolean;

    @Prop({ required: true })
    description?: string;

    @Prop({ required: false, default: false })
    recurring: boolean;

    @Prop({ type: RecurrenceSchema })
    recurrence?: Recurrence;

    @Prop({ type: Number })
    createdAt: number;

    @Prop({ type: Number })
    updatedAt: number;

    @Prop({ type: Object, default: {} })
    metadata: Record<string, any>;
}

export const BillSchema = SchemaFactory.createForClass(Bill);

// Pre-save hook to set createdAt and updatedAt as Unix timestamps
BillSchema.pre<BillDocument>("save", function (next) {
    this.updatedAt = toUnixTimestamp(Date.now());

    if (!this.createdAt) {
        this.createdAt = toUnixTimestamp(Date.now());
    }

    next();
});

// Pre-update hook to update the updatedAt field
BillSchema.pre("findOneAndUpdate", function (next) {
    this.set({ updatedAt: toUnixTimestamp(Date.now()) });
    next();
});
