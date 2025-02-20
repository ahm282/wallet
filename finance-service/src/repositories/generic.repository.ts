import { Model, FilterQuery } from "mongoose";
import { IRepository } from "@/interfaces/generic.interface";

export abstract class GenericRepository<T> implements IRepository<T> {
    constructor(protected readonly model: Model<T>) {}

    async create(data: Partial<T>): Promise<T> {
        const createdDocument = new this.model(data);
        return createdDocument.save() as unknown as T;
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id).exec();
    }

    async findOne(id: string): Promise<T | null> {
        return this.model.findOne({ _id: id }).exec();
    }

    async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
        return this.model.find(filter).exec();
    }

    async update(id: string, updateData: Partial<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async delete(id: string): Promise<boolean | null> {
        const result = await this.model.findByIdAndDelete(id).exec();
        return result ? true : null;
    }
}
