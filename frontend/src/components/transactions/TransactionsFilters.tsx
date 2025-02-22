import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Search } from "lucide-react";
import { CategorySelect } from "@/components/transactions/CategoriesDropdown";
import type { TransactionFiltersProps } from "@/types/transactions.types";

export const TransactionsFilters: React.FC<TransactionFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  dateRange,
  setDateRange,
}) => {
  return (
    <div className="flex flex-col gap-y-4 lg:flex-row lg:gap-x-5">
      <div className="flex flex-col gap-y-2 lg:xl:min-w-60">
        <Label htmlFor="search">Search Transactions</Label>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-2 translate-x-0.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            className="pl-8"
            placeholder="Search by description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-y-2 lg:xl:min-w-60">
        <Label htmlFor="category">Category</Label>
        <CategorySelect
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value)}
          isFormSelect={false}
          className="lg:h-full"
        />
      </div>
      <div className="flex flex-col gap-y-2 lg:xl:min-w-60">
        <Label>Date Range</Label>
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
      </div>
    </div>
  );
};

export default TransactionsFilters;
