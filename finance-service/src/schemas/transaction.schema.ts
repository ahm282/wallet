import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Category } from "@/enums/category.enum";

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ type: String, enum: Category, default: null })
    category: Category | null;

    @Prop({ type: Object, default: {} })
    metadata: Record<string, any>;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
