import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AccountDocument = HydratedDocument<Account>;

@Schema({ timestamps: true })
export class Account {
    @Prop({ required: true })
    userId: string; // For data segregation

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    institution: string;

    @Prop({ required: true })
    balance: number;

    @Prop({ required: true, default: "EUR" })
    currency: string;

    @Prop({ type: Object, default: {} })
    metadata: Record<string, any>;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
