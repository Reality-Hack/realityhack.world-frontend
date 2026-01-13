import { useEventrsvpsList } from "@/types/endpoints";
import { AttendeeName, EventRsvp } from "@/types/models";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

export type AttendeeWithCheckIn = AttendeeName & { checked_in_at: string | null };

type UseEventRsvpsReturn = {
  eventRsvps: EventRsvp[] | undefined;
  rsvpAttendees: AttendeeName[] | undefined;
  rsvpAttendeesWithCheckIn: AttendeeWithCheckIn[] | undefined;
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
  rsvpByAttendeeId: (attendeeId: string) => EventRsvp | undefined;
  getTotalCount: number;
  getCheckedInCount: number;
  participationClassCounts: Record<string, { total: number; checkedIn: number }>; 
};

export const useEventRsvps = (): UseEventRsvpsReturn => {
  const { data: session } = useSession();

  const { data, isLoading, error, mutate } = useEventrsvpsList({}, {
    swr: { enabled: !!session?.access_token },
    request: {
      headers: {
        'Authorization': `JWT ${session?.access_token}`
      }
    }
  });

  const attendeeIdRsvpMap = useMemo(() => {
    return data?.reduce((acc: Record<string, EventRsvp>, curr: EventRsvp) => {
      acc[curr.attendee?.id || ''] = curr;
      return acc;
    }, {});
  }, [data]);

  const rsvpByAttendeeId = (attendeeId: string): EventRsvp | undefined => {
    return attendeeIdRsvpMap?.[attendeeId];
  };

  const rsvpAttendees = useMemo(() => {
    if (!data) return [];
    return data.map((rsvp: EventRsvp) => rsvp.attendee)
      .filter((attendee: AttendeeName | undefined): attendee is AttendeeName => attendee !== undefined);
  }, [data]);

  const rsvpAttendeesWithCheckIn = useMemo((): AttendeeWithCheckIn[] => {
    if (!data) return [];
    return data
      .filter((rsvp: EventRsvp) => rsvp.attendee !== undefined)
      .map((rsvp: EventRsvp) => ({
        ...rsvp.attendee!,
        checked_in_at: rsvp.checked_in_at ?? null,
      }));
  }, [data]);

  const getTotalCount = useMemo(() => {
    return data?.length || 0;
  }, [data]);

  const getCheckedInCount = useMemo(() => {
    return data?.filter((rsvp: EventRsvp) => rsvp.checked_in_at).length || 0;
  }, [data]);

  const participationClassCounts = useMemo((): Record<string, { total: number; checkedIn: number }> => {
    if (!data) return {};
    
    return data.reduce((acc: Record<string, { total: number; checkedIn: number }>, curr: EventRsvp) => {
      const pClass = curr.participation_class || '';
      if (!acc[pClass]) {
        acc[pClass] = { total: 0, checkedIn: 0 };
      }
      acc[pClass].total += 1;
      if (curr.checked_in_at) {
        acc[pClass].checkedIn += 1;
      }
      return acc;
    }, {});
  }, [data]);

  return {
    eventRsvps: data,
    rsvpAttendees,
    rsvpAttendeesWithCheckIn,
    isLoading,
    error: error as Error | null,
    mutate,
    rsvpByAttendeeId,
    getTotalCount,
    getCheckedInCount,
    participationClassCounts,
  }
}