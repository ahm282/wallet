import { toUnixTimestamp } from "@/lib/utils";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AccountDocument = HydratedDocument<Account>;

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
export class Account {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    institution: string;

    @Prop({ required: true })
    balance: number;

    @Prop({ required: true, default: "EUR" })
    currency: string;

    @Prop({ required: true })
    userId: string;

    @Prop({ type: Number })
    createdAt: number;

    @Prop({ type: Number })
    updatedAt: number;

    @Prop({ type: Object, default: {} })
    metadata: Record<string, any>;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

// Pre-save hook to set createdAt and updatedAt as Unix timestamps
AccountSchema.pre<AccountDocument>("save", function (next) {
    this.updatedAt = toUnixTimestamp(Date.now());

    if (!this.createdAt) {
        this.createdAt = toUnixTimestamp(Date.now());
    }

    next();
});

// Pre-update hook to update the updatedAt field
AccountSchema.pre("findOneAndUpdate", function (next) {
    this.set({ updatedAt: toUnixTimestamp(Date.now()) });
    next();
});
