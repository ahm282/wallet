export interface IRepository<T> {
    create(data: Partial<T>): Promise<T>;
    findOne(id: string): Promise<T | null>;
    findAll(filter?: Partial<T>): Promise<T[]>;
    update(id: string, updateData: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean | null>;
}
