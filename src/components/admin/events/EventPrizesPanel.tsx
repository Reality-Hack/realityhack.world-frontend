import {
  useEventdestinyhardwareList,
  useEventtracksList,
} from '@/types/endpoints';
import { EventDestinyHardware, EventTrack } from '@/types/models';
import { useMemo } from 'react';
import MetaBadge from './MetaBadge';
import {
  EventPanelEmpty,
  EventPanelError,
  EventPanelLoader,
} from './EventPanelStates';
import { sortByOrder } from './sortByOrder';
import {
  formatSponsorNames,
  useSponsorNameById,
} from './useSponsorNameById';
import { useAdminEvent } from '@/contexts/AdminEventContext';

type PrizeItem = Pick<
  EventTrack,
  'id' | 'code' | 'name' | 'order' | 'sponsor_companies'
>;

type PrizeItemRowProps = {
  item: PrizeItem;
  sponsorNameById: Map<string, string>;
};

function PrizeItemRow({ item, sponsorNameById }: PrizeItemRowProps): JSX.Element {
  const sponsorIds = item.sponsor_companies ?? [];
  const sponsorNames = formatSponsorNames(sponsorIds, sponsorNameById);

  return (
    <div className="border-b border-gray-200 pb-4 dark:border-borderDark">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{item.name}</span>
          <span className="font-mono text-sm text-gray-500">{item.code}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {item.order !== undefined ? (
            <MetaBadge>Order {item.order}</MetaBadge>
          ) : null}
          {sponsorIds.length > 0 ? (
            <MetaBadge>
              {sponsorIds.length}{' '}
              {sponsorIds.length === 1 ? 'sponsor' : 'sponsors'}
              {sponsorNames ? `: ${sponsorNames}` : ''}
            </MetaBadge>
          ) : null}
        </div>
      </div>
    </div>
  );
}

type PrizeSectionProps = {
  title: string;
  items: PrizeItem[];
  sponsorNameById: Map<string, string>;
  emptyMessage: string;
};

function PrizeSection({
  title,
  items,
  sponsorNameById,
  emptyMessage,
}: PrizeSectionProps): JSX.Element {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">
        {title}{' '}
        <span className="text-sm font-normal text-gray-500">({items.length})</span>
      </h2>
      {items.length === 0 ? (
        <p className="text-gray-600">{emptyMessage}</p>
      ) : (
        items.map((item) => (
          <PrizeItemRow
            key={item.id ?? `${item.code}-${item.name}`}
            item={item}
            sponsorNameById={sponsorNameById}
          />
        ))
      )}
    </section>
  );
}

export default function EventPrizesPanel(): JSX.Element {
  const { eventId, isQueryEnabled } = useAdminEvent();
  const {
    sponsorNameById,
    isLoading: isLoadingSponsors,
    error: sponsorsError,
  } = useSponsorNameById();

  const {
    data: prizeTracks,
    isLoading: isLoadingTracks,
    error: tracksError,
  } = useEventtracksList({ event: eventId }, { swr: { enabled: isQueryEnabled } });

  const {
    data: hardwareTracks,
    isLoading: isLoadingHardware,
    error: hardwareError,
  } = useEventdestinyhardwareList({ event: eventId }, { swr: { enabled: isQueryEnabled } });

  const sortedPrizeTracks = useMemo(
    () => sortByOrder((prizeTracks ?? []) as EventTrack[]),
    [prizeTracks],
  );

  const sortedHardwareTracks = useMemo(
    () => sortByOrder((hardwareTracks ?? []) as EventDestinyHardware[]),
    [hardwareTracks],
  );

  if (isLoadingTracks || isLoadingHardware || isLoadingSponsors) {
    return <EventPanelLoader />;
  }

  if (tracksError || hardwareError || sponsorsError) {
    return (
      <EventPanelError message="Failed to load prize configuration. Please try again." />
    );
  }

  const hasAnyPrizes =
    sortedPrizeTracks.length > 0 || sortedHardwareTracks.length > 0;

  if (!hasAnyPrizes) {
    return (
      <EventPanelEmpty message="No prize tracks or hardware tracks are configured for this event." />
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      <PrizeSection
        title="Prize tracks"
        items={sortedPrizeTracks}
        sponsorNameById={sponsorNameById}
        emptyMessage="No prize tracks are configured for this event."
      />
      <PrizeSection
        title="Hardware tracks"
        items={sortedHardwareTracks}
        sponsorNameById={sponsorNameById}
        emptyMessage="No hardware tracks are configured for this event."
      />
    </div>
  );
}
