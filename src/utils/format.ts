/**
 * Format utilities for internationalization
 * Provides consistent formatting for dates, currencies, and numbers
 */
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/zh';

/**
 * Format date according to locale
 * @param date - Date string or Date object
 * @param locale - Current locale (en, zh)
 * @param format - Optional custom format
 */
export function formatDate(
  date: string | Date,
  locale: string = 'en',
  format?: string
): string {
  const defaultFormat = locale === 'zh' ? 'YYYY年MM月DD日' : 'MMM DD, YYYY';
  return dayjs(date).locale(locale).format(format || defaultFormat);
}

/**
 * Format date with time according to locale
 * @param date - Date string or Date object
 * @param locale - Current locale (en, zh)
 */
export function formatDateTime(date: string | Date, locale: string = 'en'): string {
  const format = locale === 'zh' ? 'YYYY年MM月DD日 HH:mm' : 'MMM DD, YYYY h:mm A';
  return dayjs(date).locale(locale).format(format);
}

/**
 * Format relative time (e.g., "2 days ago")
 * @param date - Date string or Date object
 * @param locale - Current locale
 */
export function formatRelativeTime(date: string | Date, locale: string = 'en'): string {
  const now = dayjs();
  const target = dayjs(date);
  const diffDays = now.diff(target, 'day');
  
  if (locale === 'zh') {
    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`;
    return `${Math.floor(diffDays / 365)}年前`;
  }
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Format currency according to locale
 * @param amount - Amount in smallest currency unit (e.g., cents)
 * @param currency - Currency code (USD, CNY, EUR, etc.)
 * @param locale - Current locale
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en'
): string {
  // If amount is large (like 800000 cents), convert to main unit
  const mainUnit = amount > 10000 ? amount / 100 : amount;
  
  return new Intl.NumberFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(mainUnit);
}

/**
 * Format number with thousand separators
 * @param num - Number to format
 * @param locale - Current locale
 */
export function formatNumber(num: number, locale: string = 'en'): string {
  return new Intl.NumberFormat(locale === 'zh' ? 'zh-CN' : 'en-US').format(num);
}

/**
 * Format percentage
 * @param value - Percentage value (0-100)
 * @param locale - Current locale
 */
export function formatPercent(value: number, locale: string = 'en'): string {
  return new Intl.NumberFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

/**
 * Format compact number (e.g., 1.2K, 3.5M)
 * @param num - Number to format
 * @param locale - Current locale
 */
export function formatCompactNumber(num: number, locale: string = 'en'): string {
  return new Intl.NumberFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
}

/**
 * Get currency symbol
 * @param currency - Currency code
 * @param locale - Current locale
 */
export function getCurrencySymbol(currency: string = 'USD', locale: string = 'en'): string {
  const formatted = formatCurrency(0, currency, locale);
  return formatted.replace(/[\d\s.,]/g, '').trim();
}

/**
 * Parse amount string to number
 * @param amountStr - Amount string (e.g., "$1,234.56" or "¥1,234")
 * @returns Number value
 */
export function parseAmount(amountStr: string): number {
  return parseFloat(amountStr.replace(/[^\d.-]/g, ''));
}