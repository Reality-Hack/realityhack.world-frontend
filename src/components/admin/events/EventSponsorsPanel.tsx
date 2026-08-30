import { EngagementDialog } from '@/components/admin/sponsors/SponsorTierDialog';
import { TIER_LABELS } from '@/components/admin/sponsors/SponsorTierSelect';
import {
  getSponsoreventengagementsListKey,
  useSponsorsList,
  useSponsoreventengagementsList,
} from '@/types/endpoints';
import { TierEnum } from '@/types/models';
import { AppLink } from '@/routing';
import { useMemo, useState } from 'react';
import { useSWRConfig } from 'swr';
import EventAdminSection from './EventAdminSection';
import {
  EventPanelError,
  EventPanelLoader,
} from './EventPanelStates';
import { useSponsorNameById } from './useSponsorNameById';
import { useAdminEvent } from '@/contexts/AdminEventContext';
import { useSession } from '@/auth/client';

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
  const { data: session } = useSession();
  const { mutate } = useSWRConfig();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const {
    sponsorNameById,
    isLoading: isLoadingSponsors,
    error: sponsorsError,
  } = useSponsorNameById();
  const {
    data: allSponsors,
    isLoading: isLoadingAllSponsors,
    error: allSponsorsError,
  } = useSponsorsList({}, { swr: { enabled: !!session?.access_token } });

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

  const availableSponsors = useMemo(() => {
    const engagedSponsorIds = new Set(
      (engagements ?? []).map((engagement) => engagement.sponsor),
    );

    return (allSponsors ?? []).filter(
      (sponsor) => sponsor.id && !engagedSponsorIds.has(sponsor.id),
    );
  }, [allSponsors, engagements]);

  const totalSponsors = engagements?.length ?? 0;

  const invalidateEngagements = async (): Promise<void> => {
    await mutate(getSponsoreventengagementsListKey({ event: eventId }));
  };

  if (
    isLoadingEngagements ||
    isLoadingSponsors ||
    isLoadingAllSponsors
  ) {
    return <EventPanelLoader />;
  }

  if (engagementsError || sponsorsError || allSponsorsError) {
    return (
      <EventPanelError message="Failed to load event sponsors. Please try again." />
    );
  }

  return (
    <div className="pb-8">
      <EventAdminSection
        title="Event sponsors"
        description={
          totalSponsors > 0
            ? `${totalSponsors} ${totalSponsors === 1 ? 'sponsor' : 'sponsors'} configured for this event`
            : 'Configure sponsor tier mappings for this event.'
        }
        addLabel="Add sponsor"
        onAdd={() => setShowAddDialog(true)}
        addDisabled={availableSponsors.length === 0}
        count={totalSponsors}
      >
        {totalSponsors === 0 ? (
          <p className="text-gray-600">
            No sponsors are configured for this event yet.
          </p>
        ) : (
          <div className="flex flex-col gap-8">
            {tierSections.map((section) => (
              <section key={section.tierKey} className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold">
                  {section.title}{' '}
                  <span className="text-sm font-normal text-gray-500">
                    ({section.sponsors.length})
                  </span>
                </h3>
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
        )}
      </EventAdminSection>

      {showAddDialog ? (
        <EngagementDialog
          showDialog={showAddDialog}
          sponsor={null}
          engagement={null}
          eventId={eventId}
          sponsorOptions={availableSponsors}
          onClose={() => setShowAddDialog(false)}
          onSuccess={() => void invalidateEngagements()}
        />
      ) : null}
    </div>
  );
}
