import { type ClassValue, clsx } from "clsx";

// Lightweight cn helper without tailwind-merge dependency
// Uses clsx for conditional class joining
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
