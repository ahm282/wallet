import { Model } from "mongoose";
import { IRepository } from "@/interfaces/generic.interface";
import { NotFoundException } from "@nestjs/common";

export abstract class GenericRepository<T> implements IRepository<T> {
    constructor(protected readonly model: Model<T>) {}

    async create(data: Partial<T>): Promise<T> {
        const createdDocument = new this.model(data);
        return createdDocument.save() as unknown as T;
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id).exec();
    }

    async findAllByUserId(userId: string): Promise<T[]> {
        return this.model.find({ userId }).exec();
    }

    async update(id: string, updateData: Partial<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async delete(id: string): Promise<void> {
        const result = await this.model.findByIdAndDelete(id).exec();

        if (!result) {
            throw new NotFoundException("Document not found!");
        }
    }
}
