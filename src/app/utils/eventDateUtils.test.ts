import { describe, expect, it } from 'vitest';
import {
  eventInputsToUtcIso,
  formatEventDate,
  formatEventDateRange,
  formatEventTime,
  getDefaultJudgingWindow,
  getDefaultMentorWindow,
  getJudgingWindow,
  isoToEventInputs,
} from './eventDateUtils';

const TZ = 'America/New_York';

const event2026 = {
  start_date: '2026-01-22T13:00:00.000Z', // 8am EST
  end_date: '2026-01-26T22:00:00.000Z', // 5pm EST
  timezone: TZ,
};

describe('eventDateUtils', () => {
  it('formats in the event timezone, not UTC', () => {
    // 03:00 UTC on Jan 22 is still Jan 21 in Boston.
    expect(formatEventDate('2026-01-22T03:00:00Z', TZ)).toBe('January 21, 2026');
    expect(formatEventTime('2026-01-22T13:00:00Z', TZ)).toBe('8am');
    expect(formatEventTime('2026-01-22T22:30:00Z', TZ)).toBe('5:30pm');
  });

  it('formats date ranges', () => {
    expect(formatEventDateRange(event2026.start_date, event2026.end_date, TZ)).toBe(
      'January 22 - 26, 2026',
    );
    expect(formatEventDateRange('2026-01-31T13:00:00Z', '2026-02-02T22:00:00Z', TZ)).toBe(
      'January 31 - February 2, 2026',
    );
  });

  it('round-trips date/time inputs through the event timezone', () => {
    const inputs = isoToEventInputs(event2026.start_date, TZ);
    expect(inputs).toEqual({ date: '2026-01-22', time: '08:00' });
    expect(eventInputsToUtcIso(inputs, TZ)).toBe('2026-01-22T13:00:00.000Z');
    expect(eventInputsToUtcIso({ date: '2026-01-22', time: '' }, TZ)).toBeNull();
  });

  it('defaults mentors to leaving a day early, keeping wall-clock time across DST', () => {
    // DST starts Mar 8, 2026: event ends 5pm EDT, mentors leave 5pm EST the day before.
    const window = getDefaultMentorWindow({
      start_date: '2026-03-06T14:00:00.000Z',
      end_date: '2026-03-08T21:00:00.000Z',
      timezone: TZ,
    });
    expect(window).toEqual({
      start: '2026-03-06T14:00:00.000Z',
      end: '2026-03-07T22:00:00.000Z',
    });
  });

  it('defaults judging to the last day of the event', () => {
    expect(getDefaultJudgingWindow(event2026)).toEqual({
      start: '2026-01-26T13:00:00.000Z',
      end: event2026.end_date,
    });
    // Start time later in the day than the end time falls back to midnight.
    expect(
      getDefaultJudgingWindow({ ...event2026, start_date: '2026-01-22T23:00:00.000Z' }).start,
    ).toBe('2026-01-26T05:00:00.000Z');
  });

  it('prefers saved judging values over defaults', () => {
    expect(
      getJudgingWindow({ ...event2026, judging_start_date: '2026-01-26T17:00:00.000Z' }),
    ).toEqual({ start: '2026-01-26T17:00:00.000Z', end: event2026.end_date });
  });
});
