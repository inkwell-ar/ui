import { BlogRegistrySDK } from '@inkwell.ar/sdk';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const registry = new BlogRegistrySDK();
