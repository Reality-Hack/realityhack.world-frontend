import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getAvailableTracks } from '@/app/api/teamformation';

export interface Track {
  label: string;
  value: string;
}

export function useSpecialTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [hardwareTracks, setHardwareTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.access_token) {
      getAvailableTracks(session.access_token)
        .then(result => {
          if (result) {
            const formattedTracks = result.track.choices.map(track => ({
              label: track.display_name,
              value: track.value
            }));

            const formattedHardwareTracks = result.destiny_hardware.choices.map(track => ({
              label: track.display_name,
              value: track.value
            }));

            setTracks(formattedTracks);
            setHardwareTracks(formattedHardwareTracks);
          }
          setIsLoading(false);
        })
        .catch(error => {
          setError(error.message);
          setIsLoading(false);
        });
    }
  }, [session]);

  return { tracks, hardwareTracks, isLoading, error };
}
