// src/components/transactions/CategoriesDropdown.tsx
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CategorySelectProps } from "@/types/transactions.types";
import { Category } from "@/types/transactions.types";

export const CategorySelect: React.FC<CategorySelectProps> = ({ value, onValueChange, isFormSelect, className }) => {
    return (
        <Select
            value={value || "all"}
            onValueChange={onValueChange}>
            <SelectTrigger className={className}>
                <SelectValue placeholder='All Categories' />
            </SelectTrigger>
            <SelectContent>
                {!isFormSelect && <SelectItem value='all'>All Categories</SelectItem>}
                {Object.values(Category).map((cat) => (
                    <SelectItem
                        key={cat}
                        value={cat}>
                        {cat}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default CategorySelect;
