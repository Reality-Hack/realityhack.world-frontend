import { TIER_LABELS } from '@/components/admin/sponsors/SponsorTierSelect';
import { useSponsoreventengagementsList } from '@/types/endpoints';
import { TierEnum } from '@/types/models';
import { AppLink } from '@/routing';
import { useMemo } from 'react';
import {
  EventPanelEmpty,
  EventPanelError,
  EventPanelLoader,
} from './EventPanelStates';
import { useSponsorNameById } from './useSponsorNameById';
import { useAdminEvent } from '@/contexts/AdminEventContext';

const TIER_ORDER: TierEnum[] = [
  TierEnum.EC,
  TierEnum.T1,
  TierEnum.T2,
  TierEnum.T3,
  TierEnum.T4,
  TierEnum.T5,
];

type EventSponsorRow = {
  sponsorId: string;
  sponsorName: string;
};

type TierSection = {
  tierKey: TierEnum | 'unassigned';
  title: string;
  sponsors: EventSponsorRow[];
};

function sortSponsorsByName(sponsors: EventSponsorRow[]): EventSponsorRow[] {
  return [...sponsors].sort((a, b) =>
    a.sponsorName.localeCompare(b.sponsorName, undefined, { sensitivity: 'base' }),
  );
}

export default function EventSponsorsPanel(): JSX.Element {
  const { eventId, isQueryEnabled } = useAdminEvent();
  const {
    sponsorNameById,
    isLoading: isLoadingSponsors,
    error: sponsorsError,
  } = useSponsorNameById();

  const {
    data: engagements,
    isLoading: isLoadingEngagements,
    error: engagementsError,
  } = useSponsoreventengagementsList(
    { event: eventId },
    { swr: { enabled: isQueryEnabled } },
  );

  const tierSections = useMemo((): TierSection[] => {
    const byTier = new Map<TierEnum | 'unassigned', EventSponsorRow[]>();

    for (const engagement of engagements ?? []) {
      const tierKey = engagement.tier ?? 'unassigned';
      const sponsorId = engagement.sponsor;
      const rows = byTier.get(tierKey) ?? [];
      rows.push({
        sponsorId,
        sponsorName: sponsorNameById.get(sponsorId) ?? sponsorId,
      });
      byTier.set(tierKey, rows);
    }

    const sections: TierSection[] = TIER_ORDER.flatMap((tier) => {
      const tierSponsors = byTier.get(tier);
      if (!tierSponsors?.length) {
        return [];
      }

      return [{
        tierKey: tier,
        title: TIER_LABELS[tier],
        sponsors: sortSponsorsByName(tierSponsors),
      }];
    });

    const unassigned = byTier.get('unassigned');
    if (unassigned?.length) {
      sections.push({
        tierKey: 'unassigned',
        title: 'Unassigned tier',
        sponsors: sortSponsorsByName(unassigned),
      });
    }

    return sections;
  }, [engagements, sponsorNameById]);

  const totalSponsors = engagements?.length ?? 0;

  if (isLoadingEngagements || isLoadingSponsors) {
    return <EventPanelLoader />;
  }

  if (engagementsError || sponsorsError) {
    return (
      <EventPanelError message="Failed to load event sponsors. Please try again." />
    );
  }

  if (totalSponsors === 0) {
    return (
      <EventPanelEmpty message="No sponsors are configured for this event." />
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      <p className="text-sm text-gray-600">
        {totalSponsors} {totalSponsors === 1 ? 'sponsor' : 'sponsors'} configured
        for this event
      </p>
      {tierSections.map((section) => (
        <section key={section.tierKey} className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">
            {section.title}{' '}
            <span className="text-sm font-normal text-gray-500">
              ({section.sponsors.length})
            </span>
          </h2>
          <ul className="flex flex-col gap-2">
            {section.sponsors.map((sponsor) => (
              <li key={sponsor.sponsorId}>
                <AppLink
                  href={`/admin/sponsors/${sponsor.sponsorId}`}
                  className="text-themePrimary hover:underline"
                >
                  {sponsor.sponsorName}
                </AppLink>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
