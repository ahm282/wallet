import { Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { toUnixTimestamp } from "@/lib/utils";

export type GoalDocument = HydratedDocument<Goal>;

@Schema({
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
export class Goal {
    @Prop({ required: true })
    name: string;

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
    targetDate: number;

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

export const GoalSchema = SchemaFactory.createForClass(Goal);
