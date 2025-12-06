// hooks/useRSVPStats.ts
import { useEventrsvpsList } from '@/types/endpoints';
import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { EventRsvp, ThemeInterestTrackEnum } from '@/types/models';
import { ShirtSizeEnum } from '@/types/models';

/**
 * Human-readable shirt size labels
 */
export enum ShirtSizeLabel {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL'
}

/**
 * Mapping from backend shirt size codes to human-readable labels
 * Based on ShirtSizeEnum: 1=XS, 2=S, 3=M, 4=L, 5=XL, 6=XXL
 */
export const SHIRT_SIZE_MAP: Record<ShirtSizeEnum, ShirtSizeLabel> = {
  [ShirtSizeEnum.NUMBER_1]: ShirtSizeLabel.XS,
  [ShirtSizeEnum.NUMBER_2]: ShirtSizeLabel.S,
  [ShirtSizeEnum.NUMBER_3]: ShirtSizeLabel.M,
  [ShirtSizeEnum.NUMBER_4]: ShirtSizeLabel.L,
  [ShirtSizeEnum.NUMBER_5]: ShirtSizeLabel.XL,
  [ShirtSizeEnum.NUMBER_6]: ShirtSizeLabel.XXL,
} as const;

/**
 * Reverse mapping from label to code (useful for filtering)
 */
export const SHIRT_SIZE_LABEL_TO_CODE: Record<ShirtSizeLabel, ShirtSizeEnum> = {
  [ShirtSizeLabel.XS]: ShirtSizeEnum.NUMBER_1,
  [ShirtSizeLabel.S]: ShirtSizeEnum.NUMBER_2,
  [ShirtSizeLabel.M]: ShirtSizeEnum.NUMBER_3,
  [ShirtSizeLabel.L]: ShirtSizeEnum.NUMBER_4,
  [ShirtSizeLabel.XL]: ShirtSizeEnum.NUMBER_5,
  [ShirtSizeLabel.XXL]: ShirtSizeEnum.NUMBER_6,
} as const;

/**
 * Helper type for shirt size counts
 */
export type ShirtSizeCounts = Record<ShirtSizeLabel, number>;

/**
 * Initialize an empty shirt size counts object
 */
export const createEmptyShirtSizeCounts = (): ShirtSizeCounts => ({
  [ShirtSizeLabel.XS]: 0,
  [ShirtSizeLabel.S]: 0,
  [ShirtSizeLabel.M]: 0,
  [ShirtSizeLabel.L]: 0,
  [ShirtSizeLabel.XL]: 0,
  [ShirtSizeLabel.XXL]: 0,
});

export interface RSVPStats {
  total: number;
  shirtSizes: ShirtSizes;
  specialInterestTrackOneCounts: number;
  specialInterestTrackTwoCounts: number;
  isLoading: boolean;
}

export interface ShirtSizes {
  S: number;
  M: number;
  L: number;
  XL: number;
  XXL: number;
}

export function useRSVPStats(): RSVPStats {
  const { data: session } = useSession();
  const {
    data: eventRsvps,
    isLoading: isLoadingEventRsvps,
  } = useEventrsvpsList({}, {
    swr: { enabled: !!session?.access_token },
    request: {
      headers: {
        'Authorization': `JWT ${session?.access_token}`
      }
    }
  });
  const shirtSizes = useMemo(() => {
    if (!eventRsvps) return createEmptyShirtSizeCounts();
    
    return eventRsvps.reduce((acc: ShirtSizeCounts, curr: EventRsvp) => {
      // Map the backend code to human-readable label
      if (curr.shirt_size && curr.shirt_size in SHIRT_SIZE_MAP) {
        const label = SHIRT_SIZE_MAP[curr.shirt_size];
        acc[label] += 1;
      }
      return acc;
    }, createEmptyShirtSizeCounts());
  }, [eventRsvps]);

  const specialInterestTrackOneCounts = useMemo(() => {
    if (isLoadingEventRsvps || !eventRsvps) return 0;

    return eventRsvps?.filter((rsvp: EventRsvp) => rsvp.special_interest_track_one === ThemeInterestTrackEnum.Y).length;
  }, [eventRsvps]);

  const specialInterestTrackTwoCounts = useMemo(() => {
    if (isLoadingEventRsvps || !eventRsvps) return 0;

    return eventRsvps?.filter((rsvp: EventRsvp) => rsvp.special_interest_track_two === ThemeInterestTrackEnum.Y).length;
  }, [eventRsvps]);

  return {
    total: eventRsvps?.length || 0,
    shirtSizes: shirtSizes,
    specialInterestTrackOneCounts,
    specialInterestTrackTwoCounts,
    isLoading: isLoadingEventRsvps
  }
}