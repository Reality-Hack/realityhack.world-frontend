import { useMemo } from 'react';
import { useSession } from '@/auth/client';
import { useEventtracksList, useEventdestinyhardwareList } from '@/types/endpoints';
import type { EventTrack, EventDestinyHardware } from '@/types/models';

export interface Track {
  id: string;
  label: string;
  value: string;
}

export function useSpecialTracks() {
  const { data: session } = useSession();

  const {
    data: eventTracks,
    isLoading: isTracksLoading,
    error: tracksError
  } = useEventtracksList(
    {},
    {
      swr: { enabled: !!session?.access_token },
    }
  );

  const {
    data: eventHardware,
    isLoading: isHardwareLoading,
    error: hardwareError
  } = useEventdestinyhardwareList(
    {},
    {
      swr: { enabled: !!session?.access_token },
    }
  );

  const tracks: Track[] = useMemo(() => 
    (eventTracks ?? []).map((t: EventTrack) => ({
      id: t.id ?? '',
      label: t.name,
      value: t.id ?? ''
    })),
    [eventTracks]
  );

  const hardwareTracks: Track[] = useMemo(() => 
    (eventHardware ?? []).map((h: EventDestinyHardware) => ({
      id: h.id ?? '',
      label: h.name,
      value: h.id ?? ''
    })),
    [eventHardware]
  );

  const isLoading = isTracksLoading || isHardwareLoading;
  const error = tracksError?.message || hardwareError?.message || null;

  return { tracks, hardwareTracks, isLoading, error };
}
