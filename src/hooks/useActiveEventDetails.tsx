import { useMemo } from 'react';
import { useEventsGetActiveRetrieve } from '@/types/endpoints';
import { PublicEvent } from '@/types/models';
import {
  formatEventDate,
  formatEventDateRange,
  formatEventTime,
  getJudgingWindow,
  getMentorWindow,
  toEventZone,
} from '@/app/utils/eventDateUtils';

/** Display strings for the active event, all rendered in the event's timezone. */
export type ActiveEventDetails = {
  name: string;
  /** e.g. "January 22, 2026" */
  startDate: string;
  /** e.g. "January 26, 2026" */
  endDate: string;
  /** e.g. "January 22 - 26, 2026" */
  dateRange: string;
  /** e.g. "8am" */
  startTime: string;
  /** e.g. "5pm" */
  endTime: string;
  /** Evening-before arrival date, e.g. "January 21" */
  arrivalDate: string;
  /** e.g. "EST" */
  timezoneAbbreviation: string;
  /** e.g. "January 22 - 25, 2026" */
  mentorDateRange: string;
  /** e.g. "Monday, January 26, 2026" */
  judgingDate: string;
  judgingStartTime: string;
  judgingEndTime: string;
  discordUrl: string | null;
  specialTracksUrl: string | null;
  parentConsentFormUrl: string | null;
  discountsPageUrl: string | null;
};

/** Generic copy used while the active event is loading or unavailable. */
const FALLBACK_DETAILS: ActiveEventDetails = {
  name: 'Reality Hack',
  startDate: 'the first day of the event',
  endDate: 'the last day of the event',
  dateRange: 'the event dates',
  startTime: 'the start time',
  endTime: 'the end time',
  arrivalDate: 'the day before the event',
  timezoneAbbreviation: '',
  mentorDateRange: 'the event dates',
  judgingDate: 'judging day',
  judgingStartTime: 'the start of judging',
  judgingEndTime: 'the end of judging',
  discordUrl: null,
  specialTracksUrl: null,
  parentConsentFormUrl: null,
  discountsPageUrl: null,
};

export function describeEvent(event: PublicEvent): ActiveEventDetails {
  const tz = event.timezone;
  const mentor = getMentorWindow(event);
  const judging = getJudgingWindow(event);
  const start = toEventZone(event.start_date, tz);

  return {
    name: event.name,
    startDate: formatEventDate(event.start_date, tz),
    endDate: formatEventDate(event.end_date, tz),
    dateRange: formatEventDateRange(event.start_date, event.end_date, tz),
    startTime: formatEventTime(event.start_date, tz),
    endTime: formatEventTime(event.end_date, tz),
    arrivalDate: start.minus({ days: 1 }).toFormat('LLLL d'),
    timezoneAbbreviation: start.toFormat('ZZZZ'),
    mentorDateRange: formatEventDateRange(mentor.start, mentor.end, tz),
    judgingDate: toEventZone(judging.start, tz).toFormat('cccc, LLLL d, yyyy'),
    judgingStartTime: formatEventTime(judging.start, tz),
    judgingEndTime: formatEventTime(judging.end, tz),
    discordUrl: event.discord_url ?? null,
    specialTracksUrl: event.special_tracks_url ?? null,
    parentConsentFormUrl: event.parent_consent_form_url ?? null,
    discountsPageUrl: event.discounts_page_url ?? null,
  };
}

export function useActiveEventDetails(): ActiveEventDetails {
  const { data: activeEvent } = useEventsGetActiveRetrieve();
  return useMemo(
    () => (activeEvent ? describeEvent(activeEvent) : FALLBACK_DETAILS),
    [activeEvent],
  );
}
