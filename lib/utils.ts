import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertAmountToMiliunits(amount: number): number {
  return Math.round(amount * 1000);
}

export function convertAmountFromMiliunits(amount: number): number {
  return amount / 1000;
}

export function formatCurrency(value: number): string {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}
