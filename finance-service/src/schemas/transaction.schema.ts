import { toUnixTimestamp } from "@/lib/utils";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Category } from "@/enums/category.enum";

export type TransactionDocument = HydratedDocument<Transaction>;

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
export class Transaction {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    date: number;

    @Prop({ required: true })
    amount: number;

    @Prop({ type: String, enum: Category, default: null })
    category: Category | null;

    @Prop({ type: Number })
    createdAt: number;

    @Prop({ type: Number })
    updatedAt: number;

    @Prop({ type: Object, default: {} })
    metadata: Record<string, any>;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

// Pre-save hook to set createdAt and updatedAt as Unix timestamps
TransactionSchema.pre<TransactionDocument>("save", function (next) {
    this.updatedAt = toUnixTimestamp(Date.now());

    if (!this.createdAt) {
        this.createdAt = toUnixTimestamp(Date.now());
    }

    next();
});

// Pre-update hook to update the updatedAt field
TransactionSchema.pre("findOneAndUpdate", function (next) {
    this.set({ updatedAt: toUnixTimestamp(Date.now()) });
    next();
});
