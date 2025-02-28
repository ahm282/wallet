import { Category } from "@/enums/category.enum";

export function toUnixTimestamp(value: Date | string | number): number {
    if (typeof value === "number") return value;
    if (value instanceof Date) return Math.floor(value.getTime() / 1000);
    return Math.floor(new Date(value).getTime() / 1000);
}

export function stringToCategory(categoryString: string): Category {
    if (Object.values(Category).includes(categoryString as Category)) {
        return categoryString as Category;
    }

    throw new Error("Invalid category");
}
