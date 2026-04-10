import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function that combines clsx and tailwind-merge
 * to properly handle Tailwind CSS class conflicts.
 * 
 * @param inputs - Class values to be combined
 * @returns Combined class string with conflicts resolved
 * 
 * @example
 * cn('px-2 py-1 bg-red hover:bg-dark-red', 'p-3 bg-[#B91C1C]')
 * // => 'hover:bg-dark-red p-3 bg-[#B91C1C]'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
