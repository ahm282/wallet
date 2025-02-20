import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type BudgetDocument = HydratedDocument<Budget>;

@Schema({ timestamps: true })
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

    @Prop({ type: Object, default: {} })
    metadata: Record<string, any>;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
