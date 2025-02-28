export interface IRepository<T> {
    create(data: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    findAllByUserId(userId: string): Promise<T[]>;
    update(id: string, updateData: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<void>;
}
