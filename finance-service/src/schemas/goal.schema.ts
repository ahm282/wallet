import { toUnixTimestamp } from "@/lib/utils";
import { Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type GoalDocument = HydratedDocument<Goal>;

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
export class Goal {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    targetAmount: number;

    @Prop({ required: true })
    currentAmount: number;

    @Virtual({
        get: function (this: Goal) {
            return this.targetAmount === this.currentAmount ? 1 : 0;
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

    @Prop({ type: Number })
    createdAt: number;

    @Prop({ type: Number })
    updatedAt: number;

    @Prop({ type: Object, default: {} })
    metadata: Record<string, any>;
}

export const GoalSchema = SchemaFactory.createForClass(Goal);

// Pre-save hook to set createdAt and updatedAt as Unix timestamps
GoalSchema.pre<GoalDocument>("save", function (next) {
    this.updatedAt = toUnixTimestamp(Date.now());

    if (!this.createdAt) {
        this.createdAt = toUnixTimestamp(Date.now());
    }

    next();
});

// Pre-update hook to update the updatedAt field
GoalSchema.pre("findOneAndUpdate", function (next) {
    this.set({ updatedAt: toUnixTimestamp(Date.now()) });
    next();
});
