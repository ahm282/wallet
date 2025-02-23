import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAuthStore } from "@/store/authStore";
import { format } from "date-fns";
import type { Goal } from "@/types/goals.types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// TODO: MAKE THIS BASED ON USER PREFERENCE
export function currencyNotation(value: number) {
    return value
        .toLocaleString("nl-BE", {
            style: "currency",
            currency: "EUR",
            currencySign: "standard",
        })
        .replace(/€\s*-\s*/, "-€ ")
        .replace(/€(?!\s)/, "€ ");
}

// Date utils
export function fromUnixTimestamp(timestamp: string | number): Date {
    if (typeof timestamp === "string") {
        return new Date(parseInt(timestamp) * 1000);
    }
    return new Date(timestamp * 1000);
}

export function formatDateString(date: Date): string {
    return format(date, "dd/MM/yyyy");
}

// AUTH UTILS
export function getToken() {
    return useAuthStore.getState().token;
}

export function getUser() {
    return useAuthStore.getState().user;
}

// Goal utils
export function createGoalFromResponse(goalResponse: any): Goal {
    return {
        _id: goalResponse._id,
        name: goalResponse.name,
        target: goalResponse.totalAmount,
        current: goalResponse.currentAmount,
        status: goalResponse.status,
        targetDate: goalResponse.targetDate,
    };
}
