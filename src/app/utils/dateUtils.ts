import { DateTime } from 'luxon';

/**
 * Format a UTC ISO datetime string for display in the user's local timezone.
 * Returns '—' for null/undefined/empty values.
 *
 * @example
 * formatDateTime('2026-09-04T04:27:16.838637Z') // "9/4/2026, 12:27 AM"
 */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  return DateTime.fromISO(iso).toLocaleString(DateTime.DATETIME_SHORT);
}

/**
 * Format a UTC ISO datetime string showing date only.
 * Returns '—' for null/undefined/empty values.
 *
 * @example
 * formatDate('2026-09-04T04:27:16.838637Z') // "9/4/2026"
 */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return DateTime.fromISO(iso).toLocaleString(DateTime.DATE_SHORT);
}

/**
 * Format a UTC ISO datetime string showing time only (12-hour with AM/PM).
 * Returns '—' for null/undefined/empty values.
 *
 * @example
 * formatTime('2026-09-04T04:27:16.838637Z') // "4:27 AM"
 */
export function formatTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  return DateTime.fromISO(iso).toLocaleString(DateTime.TIME_SIMPLE);
}
