import { toUnixTimestamp } from "@/lib/utils";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type BudgetDocument = HydratedDocument<Budget>;

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
export class Budget {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    budgeted: number;

    @Prop({ required: true })
    spent: number;

    @Prop({ required: false })
    category: string;

    @Prop({ type: Number })
    createdAt: number;

    @Prop({ type: Number })
    updatedAt: number;

    @Prop({ type: Object, default: {} })
    metadata: Record<string, any>;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);

// Pre-save hook to set createdAt and updatedAt as Unix timestamps
BudgetSchema.pre<BudgetDocument>("save", function (next) {
    this.updatedAt = toUnixTimestamp(Date.now());

    if (!this.createdAt) {
        this.createdAt = toUnixTimestamp(Date.now());
    }

    next();
});

// Pre-update hook to update the updatedAt field
BudgetSchema.pre("findOneAndUpdate", function (next) {
    this.set({ updatedAt: toUnixTimestamp(Date.now()) });
    next();
});
