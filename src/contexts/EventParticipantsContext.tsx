'use client';

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useEventrsvpsList, useTeamsList } from '@/types/endpoints';
import { AttendeeName, EventRsvp, Team, ThemeInterestTrackEnum } from '@/types/models';
import { rsvpOptions } from '@/app/api/rsvp';
import { buildChoiceMap } from '@/app/utils/buildChoiceMap';

export type AttendeeWithCheckIn = AttendeeName & { checked_in_at: string | null };

export type ChoiceMaps = {
  shirtSize: Record<string, string>;
  participationRole: Record<string, string>;
  dietaryRestrictions: Record<string, string>;
  dietaryAllergies: Record<string, string>;
  participationClass: Record<string, string>;
};

type EventParticipantsContextType = {
  eventRsvps: EventRsvp[] | undefined;
  rsvpAttendees: AttendeeName[];
  rsvpAttendeesWithCheckIn: AttendeeWithCheckIn[];
  isLoadingRsvps: boolean;
  rsvpsError: Error | null;
  mutateRsvps: () => void;
  rsvpByAttendeeId: (attendeeId: string) => EventRsvp | undefined;
  attendeeIdRsvpMap: Record<string, EventRsvp>;
  getTotalCount: number;
  getCheckedInCount: number;
  participationClassCounts: Record<string, { total: number; checkedIn: number }>;

  choiceMaps: ChoiceMaps;
  isLoadingChoiceMaps: boolean;

  shirtSizeCounts: Record<string, number>;
  specialInterestTrackOneCounts: number;
  specialInterestTrackTwoCounts: number;

  teams: Team[] | undefined;
  isLoadingTeams: boolean;
  teamsError: Error | null;
  mutateTeams: () => void;
  teamById: (teamId: string) => Team | undefined;
  teamByAttendeeId: (attendeeId: string) => Team | undefined;
};

const EventParticipantsContext = createContext<EventParticipantsContextType | undefined>(undefined);

export const useEventParticipants = (): EventParticipantsContextType => {
  const context = useContext(EventParticipantsContext);
  if (!context) {
    throw new Error('useEventParticipants must be used within EventParticipantsProvider');
  }
  return context;
};

interface EventParticipantsProviderProps {
  children: ReactNode;
}

export const EventParticipantsProvider = ({ children }: EventParticipantsProviderProps) => {
  const { data: session } = useSession();

  const [rsvpFieldOptions, setRsvpFieldOptions] = useState<any>({});
  const [isLoadingChoiceMaps, setIsLoadingChoiceMaps] = useState(true);

  useEffect(() => {
    if (!session?.access_token) return;
    setIsLoadingChoiceMaps(true);
    rsvpOptions({})
      .then(setRsvpFieldOptions)
      .catch(console.error)
      .finally(() => setIsLoadingChoiceMaps(false));
  }, [session?.access_token]);

  const choiceMaps = useMemo((): ChoiceMaps => ({
    shirtSize: buildChoiceMap(rsvpFieldOptions, 'shirt_size'),
    participationRole: buildChoiceMap(rsvpFieldOptions, 'participation_role'),
    dietaryRestrictions: buildChoiceMap(rsvpFieldOptions, 'dietary_restrictions'),
    dietaryAllergies: buildChoiceMap(rsvpFieldOptions, 'dietary_allergies'),
    participationClass: buildChoiceMap(rsvpFieldOptions, 'participation_class'),
  }), [rsvpFieldOptions]);

  const requestConfig = useMemo(() => ({
    swr: { enabled: !!session?.access_token },
    request: {
      headers: { 'Authorization': `JWT ${session?.access_token}` }
    }
  }), [session?.access_token]);

  const {
    data: eventRsvps,
    isLoading: isLoadingRsvps,
    error: rsvpsError,
    mutate: mutateRsvps
  } = useEventrsvpsList({}, requestConfig);

  const {
    data: teams,
    isLoading: isLoadingTeams,
    error: teamsError,
    mutate: mutateTeams
  } = useTeamsList({}, requestConfig);

  const attendeeIdRsvpMap = useMemo(() => {
    if (!eventRsvps) return {};
    return eventRsvps.reduce((acc: Record<string, EventRsvp>, rsvp: EventRsvp) => {
      if (rsvp.attendee?.id) {
        acc[rsvp.attendee.id] = rsvp;
      }
      return acc;
    }, {});
  }, [eventRsvps]);

  const rsvpByAttendeeId = useMemo(
    () => (attendeeId: string): EventRsvp | undefined => attendeeIdRsvpMap[attendeeId],
    [attendeeIdRsvpMap]
  );

  const teamIdMap = useMemo(() => {
    if (!teams) return {};
    return Object.fromEntries(teams.map(t => [t.id, t]));
  }, [teams]);

  const attendeeTeamMap = useMemo(() => {
    if (!teams) return {};
    const map: Record<string, Team> = {};
    teams.forEach(team => {
      team.attendees?.forEach((attendeeId: string) => {
        map[attendeeId] = team;
      });
    });
    return map;
  }, [teams]);

  const teamById = useMemo(
    () => (teamId: string): Team | undefined => teamIdMap[teamId],
    [teamIdMap]
  );

  const teamByAttendeeId = useMemo(
    () => (attendeeId: string): Team | undefined => attendeeTeamMap[attendeeId],
    [attendeeTeamMap]
  );

  const rsvpAttendees = useMemo((): AttendeeName[] => {
    if (!eventRsvps) return [];
    return eventRsvps
      .map((rsvp: EventRsvp) => rsvp.attendee)
      .filter((attendee): attendee is AttendeeName => attendee !== undefined);
  }, [eventRsvps]);

  const rsvpAttendeesWithCheckIn = useMemo((): AttendeeWithCheckIn[] => {
    if (!eventRsvps) return [];
    return eventRsvps
      .filter((rsvp: EventRsvp) => rsvp.attendee !== undefined)
      .map((rsvp: EventRsvp) => ({
        ...rsvp.attendee!,
        checked_in_at: rsvp.checked_in_at ?? null,
      }));
  }, [eventRsvps]);

  const getTotalCount = useMemo(() => eventRsvps?.length || 0, [eventRsvps]);

  const getCheckedInCount = useMemo(
    () => eventRsvps?.filter((rsvp: EventRsvp) => rsvp.checked_in_at).length || 0,
    [eventRsvps]
  );

  const participationClassCounts = useMemo((): Record<string, { total: number; checkedIn: number }> => {
    if (!eventRsvps) return {};
    return eventRsvps.reduce((acc: Record<string, { total: number; checkedIn: number }>, curr: EventRsvp) => {
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
  }, [eventRsvps]);

  const shirtSizeCounts = useMemo((): Record<string, number> => {
    if (!eventRsvps || !Object.keys(choiceMaps.shirtSize).length) return {};
    return eventRsvps.reduce((acc: Record<string, number>, rsvp: EventRsvp) => {
      if (rsvp.shirt_size) {
        const label = choiceMaps.shirtSize[rsvp.shirt_size] || 'Unknown';
        acc[label] = (acc[label] || 0) + 1;
      }
      return acc;
    }, {});
  }, [eventRsvps, choiceMaps.shirtSize]);

  const specialInterestTrackOneCounts = useMemo(() => {
    if (!eventRsvps) return 0;
    return eventRsvps.filter(
      (rsvp: EventRsvp) => rsvp.special_interest_track_one === ThemeInterestTrackEnum.Y
    ).length;
  }, [eventRsvps]);

  const specialInterestTrackTwoCounts = useMemo(() => {
    if (!eventRsvps) return 0;
    return eventRsvps.filter(
      (rsvp: EventRsvp) => rsvp.special_interest_track_two === ThemeInterestTrackEnum.Y
    ).length;
  }, [eventRsvps]);

  const contextValue: EventParticipantsContextType = {
    eventRsvps,
    rsvpAttendees,
    rsvpAttendeesWithCheckIn,
    isLoadingRsvps,
    rsvpsError: rsvpsError as Error | null,
    mutateRsvps,
    rsvpByAttendeeId,
    attendeeIdRsvpMap,
    getTotalCount,
    getCheckedInCount,
    participationClassCounts,

    choiceMaps,
    isLoadingChoiceMaps,

    shirtSizeCounts,
    specialInterestTrackOneCounts,
    specialInterestTrackTwoCounts,

    teams,
    isLoadingTeams,
    teamsError: teamsError as Error | null,
    mutateTeams,
    teamById,
    teamByAttendeeId,
  };

  return (
    <EventParticipantsContext.Provider value={contextValue}>
      {children}
    </EventParticipantsContext.Provider>
  );
};

