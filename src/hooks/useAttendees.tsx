'use client';
import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { 
  useAttendeesList, 
  AttendeesListQueryResult, 
  AttendeesListQueryError,
  useAttendeesRetrieve,
  AttendeesRetrieveQueryResult,
  AttendeesRetrieveQueryError
} from '@/types/endpoints';
import { 
  AttendeesListParams, 
  AttendeeList,
  Attendee,
  ParticipationClassEnum
} from '@/types/models';
import { KeyedMutator } from 'swr';

type UseAttendeesOptions = {
  params?: AttendeesListParams;
  enabled?: boolean;
};

type UseAttendeesReturn = {
  attendees: AttendeeList[] | undefined;
  isLoading: boolean;
  error: AttendeesListQueryError | null;
  mutate: KeyedMutator<AttendeeList[]>; // Change this from () => void

  attendeesMap: Record<string, AttendeeList>;
  checkedInAttendees: AttendeeList[];
  participationClassCounts: Record<string, { total: number; checkedIn: number }>; 
  
  getAttendeeById: (id: string) => AttendeeList | undefined;
  isAttendeeCheckedIn: (id: string) => boolean;
  getCheckedInCount: () => number;
  getTotalCount: () => number;
};

type UseAttendeeOptions = {
  enabled?: boolean;
  fetchIndividual?: boolean;
};

type UseAttendeeReturn = {
  attendee: Attendee | AttendeeList | undefined;
  isLoading: boolean;
  error: AttendeesRetrieveQueryError | AttendeesListQueryError | null;
  mutate: () => void;
  
  listFallback: AttendeeList | undefined;
  individualData: Attendee | undefined;
  isLoadingIndividual: boolean; 
  isLoadingList: boolean;
  
  hasFullData: () => boolean;
  isFromList: () => boolean;
};

export const useAttendees = (options: UseAttendeesOptions = {}): UseAttendeesReturn => {
  const { data: session } = useSession();
  const { params = {}, enabled = true } = options;

  const { 
    data: attendees, 
    isLoading, 
    error, 
    mutate 
  } = useAttendeesList(params, {
    swr: { enabled: enabled && !!session?.access_token }, 
    request: {
      headers: {
        'Authorization': `JWT ${session?.access_token}`
      }
    }
  });

  const attendeesMap = useMemo((): Record<string, AttendeeList> => {
    if (!attendees) return {};
    return Object.fromEntries(
      attendees.map(attendee => [attendee.id || '', attendee]).filter(([id]) => id !== '')
    );
  }, [attendees]);

  const checkedInAttendees = useMemo((): AttendeeList[] => {
    if (!attendees) return [];
    return attendees.filter(attendee => attendee.checked_in_at);
  }, [attendees]);

  const participationClassCounts = useMemo((): Record<string, { total: number; checkedIn: number }> => {
    if (!attendees) return {};
    
    const result: Record<string, { total: number; checkedIn: number }> = {};
    
    attendees.forEach(attendee => {
      if (attendee.participation_class) {
        if (!result[attendee.participation_class]) {
          result[attendee.participation_class] = { total: 0, checkedIn: 0 };
        }
        result[attendee.participation_class].total += 1;
        if (attendee.checked_in_at) {
          result[attendee.participation_class].checkedIn += 1;
        }
      }
    });
    
    return result;
  }, [attendees]);

  const getAttendeeById = (id: string): AttendeeList | undefined => {
    return attendeesMap[id];
  };

  const isAttendeeCheckedIn = (id: string): boolean => {
    const attendee = getAttendeeById(id);
    return !!attendee?.checked_in_at;
  };

  const getCheckedInCount = (): number => {
    return checkedInAttendees.length;
  };

  const getTotalCount = (): number => {
    return attendees?.length || 0;
  };

  return {
    attendees,
    isLoading,
    error: error as AttendeesListQueryError | null,
    mutate,
    
    attendeesMap,
    checkedInAttendees,
    participationClassCounts,
    
    getAttendeeById,
    isAttendeeCheckedIn,
    getCheckedInCount,
    getTotalCount,
  };
};

export const useAttendee = (
  attendeeId: string | undefined, 
  options: UseAttendeeOptions = {}
): UseAttendeeReturn => {
  const { data: session } = useSession();
  const { enabled = true, fetchIndividual = true } = options;
  
  const { getAttendeeById, isLoading: isLoadingList, error: listError } = useAttendees({
    enabled: enabled && !!attendeeId
  });

  const { 
    data: individualData, 
    isLoading: isLoadingIndividual, 
    error: individualError,
    mutate
  } = useAttendeesRetrieve(attendeeId || '', {
    swr: { 
      enabled: enabled && fetchIndividual && !!attendeeId && !!session?.access_token,
    }, 
    request: {
      headers: {
        'Authorization': `JWT ${session?.access_token}`
      }
    }
  });

  const listFallback = useMemo(() => {
    return attendeeId ? getAttendeeById(attendeeId) : undefined;
  }, [attendeeId, getAttendeeById]);

  const attendee = individualData || listFallback;
  const isLoading = fetchIndividual ? isLoadingIndividual : isLoadingList;
  const error = individualError || listError;

  const hasFullData = (): boolean => {
    return !!individualData;
  };

  const isFromList = (): boolean => {
    return !individualData && !!listFallback;
  };

  return {
    attendee,
    isLoading,
    error: error as AttendeesRetrieveQueryError | AttendeesListQueryError | null,
    mutate,
    
    listFallback,
    individualData,
    isLoadingIndividual,
    isLoadingList,
    
    hasFullData,
    isFromList,
  };
};

export type { UseAttendeesOptions, UseAttendeesReturn, UseAttendeeOptions, UseAttendeeReturn };
