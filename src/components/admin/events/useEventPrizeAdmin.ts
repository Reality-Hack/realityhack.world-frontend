import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  eventdestinyhardwareDestroy,
  eventtracksDestroy,
} from '@/types/endpoints';
import {
  type EventPrizeTrackItem,
  nextPrizeTrackOrder,
  type PrizeTrackKind,
} from './eventPrizeTypes';
import { useAdminFormDialog } from './useAdminFormDialog';

export type { EventPrizeTrackItem as EventPrizeItem } from './eventPrizeTypes';

type UseEventPrizeAdminArgs = {
  eventId: string;
  prizeTracks: EventPrizeTrackItem[];
  hardwareTracks: EventPrizeTrackItem[];
  invalidatePrizesCache: () => Promise<void>;
};

export type UseEventPrizeAdminResult = {
  formKind: PrizeTrackKind;
  showForm: boolean;
  itemForForm: EventPrizeTrackItem | null;
  defaultOrder: number;
  openCreatePrizeTrack: () => void;
  openCreateHardwareTrack: () => void;
  openEditPrizeTrack: (item: EventPrizeTrackItem) => void;
  openEditHardwareTrack: (item: EventPrizeTrackItem) => void;
  closeForm: () => void;
  deletePrizeTrack: (item: EventPrizeTrackItem) => Promise<void>;
  deleteHardwareTrack: (item: EventPrizeTrackItem) => Promise<void>;
  handleFormSuccess: () => Promise<void>;
};

export function useEventPrizeAdmin({
  eventId,
  prizeTracks,
  hardwareTracks,
  invalidatePrizesCache,
}: UseEventPrizeAdminArgs): UseEventPrizeAdminResult {
  const dialog = useAdminFormDialog<EventPrizeTrackItem>();
  const [formKind, setFormKind] = useState<PrizeTrackKind>('prize');

  const eventRequestOptions = useMemo(
    () => ({ params: { event: eventId } }),
    [eventId],
  );

  const defaultOrder = useMemo(() => {
    const items = formKind === 'prize' ? prizeTracks : hardwareTracks;
    return nextPrizeTrackOrder(items);
  }, [formKind, hardwareTracks, prizeTracks]);

  const handleFormSuccess = useCallback(async (): Promise<void> => {
    await invalidatePrizesCache();
  }, [invalidatePrizesCache]);

  const deleteTrack = useCallback(
    async (
      item: EventPrizeTrackItem,
      kind: PrizeTrackKind,
      resourceLabel: string,
    ): Promise<void> => {
      if (!item.id) {
        return;
      }

      const confirmed = window.confirm(
        `Delete ${resourceLabel} "${item.name}" (${item.code})?`,
      );
      if (!confirmed) {
        return;
      }

      try {
        if (kind === 'prize') {
          await eventtracksDestroy(item.id, eventRequestOptions);
        } else {
          await eventdestinyhardwareDestroy(item.id, eventRequestOptions);
        }
        toast.success(`${resourceLabel} deleted`);
        await invalidatePrizesCache();
      } catch {
        toast.error(`Failed to delete ${resourceLabel.toLowerCase()}`);
      }
    },
    [eventRequestOptions, invalidatePrizesCache],
  );

  const deletePrizeTrack = useCallback(
    (item: EventPrizeTrackItem) => deleteTrack(item, 'prize', 'Prize track'),
    [deleteTrack],
  );

  const deleteHardwareTrack = useCallback(
    (item: EventPrizeTrackItem) =>
      deleteTrack(item, 'hardware', 'Hardware track'),
    [deleteTrack],
  );

  const openCreatePrizeTrack = useCallback((): void => {
    setFormKind('prize');
    dialog.openCreate();
  }, [dialog]);

  const openCreateHardwareTrack = useCallback((): void => {
    setFormKind('hardware');
    dialog.openCreate();
  }, [dialog]);

  const openEditPrizeTrack = useCallback(
    (item: EventPrizeTrackItem): void => {
      setFormKind('prize');
      dialog.openEdit(item);
    },
    [dialog],
  );

  const openEditHardwareTrack = useCallback(
    (item: EventPrizeTrackItem): void => {
      setFormKind('hardware');
      dialog.openEdit(item);
    },
    [dialog],
  );

  return {
    formKind,
    showForm: dialog.showForm,
    itemForForm: dialog.itemForForm,
    defaultOrder,
    openCreatePrizeTrack,
    openCreateHardwareTrack,
    openEditPrizeTrack,
    openEditHardwareTrack,
    closeForm: dialog.closeForm,
    deletePrizeTrack,
    deleteHardwareTrack,
    handleFormSuccess,
  };
}
