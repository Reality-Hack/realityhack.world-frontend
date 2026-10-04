import {
  useEventdestinyhardwareList,
  useEventtracksList,
  useSponsoreventengagementsList,
} from '@/types/endpoints';
import { EventDestinyHardware, EventTrack } from '@/types/models';
import { useMemo } from 'react';
import EventAdminSection from './EventAdminSection';
import EventPrizeTrackForm from './EventPrizeTrackForm';
import MetaBadge from './MetaBadge';
import {
  EventPanelError,
  EventPanelLoader,
} from './EventPanelStates';
import { sortByOrder } from './sortByOrder';
import {
  formatSponsorNames,
  useSponsorNameById,
} from './useSponsorNameById';
import { useAdminEvent } from '@/contexts/AdminEventContext';
import { EventPrizeTrackItem, toPrizeTrackItem } from './eventPrizeTypes';
import { useEventPrizeAdmin } from './useEventPrizeAdmin';
import AppButton from '@/components/common/AppButton';

type PrizeItemRowProps = {
  item: EventPrizeTrackItem;
  sponsorNameById: Map<string, string>;
  onEdit: () => void;
  onDelete: () => void;
};

function PrizeItemRow({
  item,
  sponsorNameById,
  onEdit,
  onDelete,
}: PrizeItemRowProps): JSX.Element {
  const sponsorIds = item.sponsor_companies ?? [];
  const sponsorNames = formatSponsorNames(sponsorIds, sponsorNameById);

  return (
    <div className="flex flex-col gap-3 border-b border-gray-200 pb-4 dark:border-borderDark sm:flex-row sm:items-start sm:justify-between">
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
      <div className="flex flex-row gap-2">
        <AppButton size="small" onClick={onEdit}>
          Edit
        </AppButton>
        <AppButton size="small" onClick={onDelete}>
          Delete
        </AppButton>
      </div>
    </div>
  );
}

type PrizeItemListProps = {
  items: EventPrizeTrackItem[];
  sponsorNameById: Map<string, string>;
  emptyMessage: string;
  onEdit: (item: EventPrizeTrackItem) => void;
  onDelete: (item: EventPrizeTrackItem) => void;
};

function PrizeItemList({
  items,
  sponsorNameById,
  emptyMessage,
  onEdit,
  onDelete,
}: PrizeItemListProps): JSX.Element {
  if (items.length === 0) {
    return <p className="text-gray-600">{emptyMessage}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <PrizeItemRow
          key={item.id ?? `${item.code}-${item.name}`}
          item={item}
          sponsorNameById={sponsorNameById}
          onEdit={() => onEdit(item)}
          onDelete={() => void onDelete(item)}
        />
      ))}
    </div>
  );
}

const PRIZE_TRACKS_DESCRIPTION =
  'Thematic prize tracks and categories.';
const HARDWARE_TRACKS_DESCRIPTION =
  'Prize tracks linked to specific devices or hardware from the catalog.';

export default function EventPrizesPanel(): JSX.Element {
  const { eventId, isQueryEnabled, invalidatePrizesCache } = useAdminEvent();

  const {
    sponsorNameById,
    isLoading: isLoadingSponsors,
    error: sponsorsError,
  } = useSponsorNameById();

  const {
    data: eventEngagements,
    isLoading: isLoadingEngagements,
    error: engagementsError,
  } = useSponsoreventengagementsList(
    { event: eventId },
    { swr: { enabled: isQueryEnabled } },
  );

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
    () => sortByOrder((prizeTracks ?? []) as EventTrack[]).map(toPrizeTrackItem),
    [prizeTracks],
  );

  const sortedHardwareTracks = useMemo(
    () =>
      sortByOrder((hardwareTracks ?? []) as EventDestinyHardware[]).map(
        toPrizeTrackItem,
      ),
    [hardwareTracks],
  );

  const sponsorOptions = useMemo(
    () =>
      (eventEngagements ?? [])
        .filter((engagement) => engagement.tier !== null && engagement.tier !== undefined)
        .map((engagement) => ({
          value: engagement.sponsor,
          label: sponsorNameById.get(engagement.sponsor) ?? engagement.sponsor,
        })),
    [eventEngagements, sponsorNameById],
  );

  const {
    formKind,
    showForm,
    itemForForm,
    defaultOrder,
    openCreatePrizeTrack,
    openCreateHardwareTrack,
    openEditPrizeTrack,
    openEditHardwareTrack,
    closeForm,
    deletePrizeTrack,
    deleteHardwareTrack,
    handleFormSuccess,
  } = useEventPrizeAdmin({
    eventId,
    prizeTracks: sortedPrizeTracks,
    hardwareTracks: sortedHardwareTracks,
    invalidatePrizesCache,
  });

  if (isLoadingTracks || isLoadingHardware || isLoadingSponsors || isLoadingEngagements) {
    return <EventPanelLoader />;
  }

  if (tracksError || hardwareError || sponsorsError || engagementsError) {
    return (
      <EventPanelError message="Failed to load prize configuration. Please try again." />
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      <EventAdminSection
        title="Prize tracks"
        description={PRIZE_TRACKS_DESCRIPTION}
        addLabel="Add prize track"
        onAdd={openCreatePrizeTrack}
        count={sortedPrizeTracks.length}
      >
        <PrizeItemList
          items={sortedPrizeTracks}
          sponsorNameById={sponsorNameById}
          emptyMessage="No prize tracks are configured for this event yet."
          onEdit={openEditPrizeTrack}
          onDelete={deletePrizeTrack}
        />
      </EventAdminSection>
      <EventAdminSection
        title="Hardware tracks"
        description={HARDWARE_TRACKS_DESCRIPTION}
        addLabel="Add hardware track"
        onAdd={openCreateHardwareTrack}
        count={sortedHardwareTracks.length}
      >
        <PrizeItemList
          items={sortedHardwareTracks}
          sponsorNameById={sponsorNameById}
          emptyMessage="No hardware tracks are configured for this event yet."
          onEdit={openEditHardwareTrack}
          onDelete={deleteHardwareTrack}
        />
      </EventAdminSection>

      {showForm ? (
        <EventPrizeTrackForm
          kind={formKind}
          showDialog={showForm}
          item={itemForForm}
          eventId={eventId}
          defaultOrder={defaultOrder}
          sponsorOptions={sponsorOptions}
          onClose={closeForm}
          onSuccess={() => void handleFormSuccess()}
        />
      ) : null}
    </div>
  );
}
