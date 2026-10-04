import { DateTime } from 'luxon';
import { Event } from '@/types/models';

/**
 * Event datetimes are stored in UTC and rendered in the event's own IANA
 * timezone (not the viewer's), so a Boston event reads the same everywhere.
 * Use the helpers in dateUtils.ts for viewer-local timestamps instead.
 */

export const DEFAULT_EVENT_TIMEZONE = 'America/New_York';

export const COMMON_EVENT_TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Tokyo',
  'UTC',
];

export type EventSchedule = Pick<
  Event,
  | 'start_date'
  | 'end_date'
  | 'timezone'
  | 'mentor_start_date'
  | 'mentor_end_date'
  | 'judging_start_date'
  | 'judging_end_date'
>;

export type DateTimeWindow = { start: string; end: string };

export type DateTimeInputs = { date: string; time: string };

export function toEventZone(iso: string, timezone: string): DateTime {
  return DateTime.fromISO(iso, { zone: timezone });
}

function toUtcIso(dt: DateTime): string {
  return dt.toUTC().toISO() ?? '';
}

/** e.g. "Thu, Jan 22, 2026, 8:00 AM EST" */
export function formatEventDateTime(iso: string | null | undefined, timezone: string): string {
  if (!iso) return '—';
  return toEventZone(iso, timezone).toFormat('ccc, LLL d, yyyy, h:mm a ZZZZ');
}

/** e.g. "January 22, 2026" */
export function formatEventDate(iso: string | null | undefined, timezone: string): string {
  if (!iso) return '—';
  return toEventZone(iso, timezone).toFormat('LLLL d, yyyy');
}

/** e.g. "8am" or "5:30pm" */
export function formatEventTime(iso: string | null | undefined, timezone: string): string {
  if (!iso) return '—';
  const dt = toEventZone(iso, timezone);
  return dt.toFormat(dt.minute === 0 ? 'ha' : 'h:mma').toLowerCase();
}

/** e.g. "January 22 - 26, 2026" or "January 31 - February 2, 2026" */
export function formatEventDateRange(startIso: string, endIso: string, timezone: string): string {
  const start = toEventZone(startIso, timezone);
  const end = toEventZone(endIso, timezone);
  if (start.hasSame(end, 'day')) return start.toFormat('LLLL d, yyyy');
  if (start.hasSame(end, 'month')) {
    return `${start.toFormat('LLLL d')} - ${end.toFormat('d, yyyy')}`;
  }
  if (start.hasSame(end, 'year')) {
    return `${start.toFormat('LLLL d')} - ${end.toFormat('LLLL d, yyyy')}`;
  }
  return `${start.toFormat('LLLL d, yyyy')} - ${end.toFormat('LLLL d, yyyy')}`;
}

/** Split a UTC ISO string into date/time input values in the event's timezone. */
export function isoToEventInputs(iso: string | null | undefined, timezone: string): DateTimeInputs {
  if (!iso) return { date: '', time: '' };
  const dt = toEventZone(iso, timezone);
  return { date: dt.toISODate() ?? '', time: dt.toFormat('HH:mm') };
}

/** Interpret date/time input values as wall-clock time in the event's timezone. */
export function eventInputsToUtcIso({ date, time }: DateTimeInputs, timezone: string): string | null {
  const d = date.trim();
  const t = time.trim();
  if (!d || !t) return null;
  const dt = DateTime.fromISO(`${d}T${t}`, { zone: timezone });
  if (!dt.isValid) return null;
  return toUtcIso(dt);
}

/**
 * Mentors start with the event and leave a day early.
 * Source of truth for this rule; the backend mirrors it in event_dates.py.
 */
export function getDefaultMentorWindow(event: EventSchedule): DateTimeWindow {
  const end = toEventZone(event.end_date, event.timezone).minus({ days: 1 });
  return { start: event.start_date, end: toUtcIso(end) };
}

/**
 * Judges attend only the last day: from the event's daily start time on the
 * final day until the event ends (midnight if the start time is later in the
 * day than the end time).
 * Source of truth for this rule; the backend mirrors it in event_dates.py.
 */
export function getDefaultJudgingWindow(event: EventSchedule): DateTimeWindow {
  const start = toEventZone(event.start_date, event.timezone);
  const end = toEventZone(event.end_date, event.timezone);
  let judgingStart = end.set({
    hour: start.hour,
    minute: start.minute,
    second: 0,
    millisecond: 0,
  });
  if (judgingStart > end) {
    judgingStart = end.startOf('day');
  }
  return { start: toUtcIso(judgingStart), end: event.end_date };
}

/** Saved mentor window, falling back to the default for any unset bound. */
export function getMentorWindow(event: EventSchedule): DateTimeWindow {
  const defaults = getDefaultMentorWindow(event);
  return {
    start: event.mentor_start_date ?? defaults.start,
    end: event.mentor_end_date ?? defaults.end,
  };
}

/** Saved judging window, falling back to the default for any unset bound. */
export function getJudgingWindow(event: EventSchedule): DateTimeWindow {
  const defaults = getDefaultJudgingWindow(event);
  return {
    start: event.judging_start_date ?? defaults.start,
    end: event.judging_end_date ?? defaults.end,
  };
}
