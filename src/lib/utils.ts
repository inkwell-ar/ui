import { BlogRegistrySDK } from '@inkwell.ar/sdk';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Utility function to check if a string is an Arweave transaction ID
export function isArweaveTxId(str: string): boolean {
    return /^[a-zA-Z0-9_-]{43}$/.test(str);
}

// Utility function to check if a string is a valid URL
export function isValidUrl(str: string): boolean {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
}

// Utility function to get proper image source
export function getImageSource(logo: string): string {
    if (isArweaveTxId(logo)) {
        return `https://arweave.net/${logo}`;
    }
    if (isValidUrl(logo)) {
        return logo;
    }
    return ''; // Return empty string for invalid logos
}

export const registry = new BlogRegistrySDK();
