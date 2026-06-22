import { useSession } from '@/auth/client';
import { useSponsorsList } from '@/types/endpoints';
import { useMemo } from 'react';

type UseSponsorNameByIdResult = {
  sponsorNameById: Map<string, string>;
  isLoading: boolean;
  error: unknown;
};

export function useSponsorNameById(): UseSponsorNameByIdResult {
  const { data: session } = useSession();
  const {
    data: sponsors,
    isLoading,
    error,
  } = useSponsorsList({}, { swr: { enabled: !!session?.access_token } });

  const sponsorNameById = useMemo(() => {
    const byId = new Map<string, string>();
    for (const sponsor of sponsors ?? []) {
      if (sponsor.id) {
        byId.set(sponsor.id, sponsor.name);
      }
    }
    return byId;
  }, [sponsors]);

  return { sponsorNameById, isLoading, error };
}

export function formatSponsorNames(
  sponsorIds: string[],
  sponsorNameById: Map<string, string>,
): string {
  if (sponsorIds.length === 0) {
    return '';
  }

  return sponsorIds
    .map((id) => sponsorNameById.get(id) ?? id)
    .join(', ');
}
