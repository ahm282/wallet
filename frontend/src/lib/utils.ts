import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// TODO: MAKE THIS BASED ON USER PREFERENCE
export function currencyNotation(value: number) {
  return value.toLocaleString("nl-BE", {
    style: "currency",
    currency: "EUR",
  });
}
