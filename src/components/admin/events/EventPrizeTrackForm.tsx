import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AppDialog from '@/components/common/AppDialog';
import { CustomMultiSelect } from '@/components/CustomSelect';
import { TextInput } from '@/components/Inputs';
import {
  eventdestinyhardwareCreate,
  eventdestinyhardwarePartialUpdate,
  eventtracksCreate,
  eventtracksPartialUpdate,
} from '@/types/endpoints';
import {
  EventDestinyHardwareRequest,
  EventTrackRequest,
  PatchedEventDestinyHardwareRequest,
  PatchedEventTrackRequest,
} from '@/types/models';
import type { EventPrizeTrackItem, PrizeTrackKind } from './eventPrizeTypes';

type SponsorOption = {
  value: string;
  label: string;
};

type EventPrizeTrackFormProps = {
  kind: PrizeTrackKind;
  showDialog: boolean;
  item: EventPrizeTrackItem | null;
  eventId: string;
  defaultOrder: number;
  sponsorOptions: SponsorOption[];
  onClose: () => void;
  onSuccess: () => void;
};

function formTitle(kind: PrizeTrackKind, isEdit: boolean): string {
  const label = kind === 'prize' ? 'Prize Track' : 'Hardware Track';
  return isEdit ? `Edit ${label}` : `Add ${label}`;
}

export default function EventPrizeTrackForm({
  kind,
  showDialog,
  item,
  eventId,
  defaultOrder,
  sponsorOptions,
  onClose,
  onSuccess,
}: EventPrizeTrackFormProps): JSX.Element {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [order, setOrder] = useState('0');
  const [sponsorCompanyIds, setSponsorCompanyIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = item?.id !== undefined;

  useEffect(() => {
    if (!showDialog) {
      return;
    }
    setCode(item?.code ?? '');
    setName(item?.name ?? '');
    setOrder(String(item?.order ?? defaultOrder));
    setSponsorCompanyIds(item?.sponsor_companies ?? []);
  }, [defaultOrder, item, showDialog]);

  const eventRequestOptions = { params: { event: eventId } };

  async function handleSubmit(): Promise<void> {
    const trimmedCode = code.trim();
    const trimmedName = name.trim();
    const parsedOrder = Number.parseInt(order, 10);

    if (!trimmedCode || !trimmedName) {
      toast.error('Code and name are required.');
      return;
    }

    if (Number.isNaN(parsedOrder)) {
      toast.error('Order must be a number.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (kind === 'prize') {
        if (isEdit && item?.id) {
          const payload: PatchedEventTrackRequest = {
            code: trimmedCode,
            name: trimmedName,
            order: parsedOrder,
            sponsor_companies: sponsorCompanyIds,
          };
          await eventtracksPartialUpdate(item.id, payload, eventRequestOptions);
        } else {
          const payload: EventTrackRequest = {
            code: trimmedCode,
            name: trimmedName,
            order: parsedOrder,
            sponsor_companies: sponsorCompanyIds,
          };
          await eventtracksCreate(payload, eventRequestOptions);
        }
      } else if (isEdit && item?.id) {
        const payload: PatchedEventDestinyHardwareRequest = {
          code: trimmedCode,
          name: trimmedName,
          order: parsedOrder,
          sponsor_companies: sponsorCompanyIds,
        };
        await eventdestinyhardwarePartialUpdate(item.id, payload, eventRequestOptions);
      } else {
        const payload: EventDestinyHardwareRequest = {
          code: trimmedCode,
          name: trimmedName,
          order: parsedOrder,
          sponsor_companies: sponsorCompanyIds,
        };
        await eventdestinyhardwareCreate(payload, eventRequestOptions);
      }

      toast.success(isEdit ? 'Track updated' : 'Track created');
      onSuccess();
      onClose();
    } catch {
      toast.error(isEdit ? 'Failed to update track' : 'Failed to create track');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppDialog
      showDialog={showDialog}
      onClose={onClose}
      title={formTitle(kind, isEdit)}
      onSubmit={() => void handleSubmit()}
      isSubmitting={isSubmitting}
    >
      <div className="flex flex-col gap-4 pt-1">
        <TextInput
          name="code"
          placeholder="Code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          required
        >
          Code
        </TextInput>
        <TextInput
          name="name"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        >
          Name
        </TextInput>
        <TextInput
          name="order"
          placeholder="Order"
          type="number"
          value={order}
          onChange={(event) => setOrder(event.target.value)}
          required
        >
          Order
        </TextInput>
        <div className="-mb-4 text-sm font-medium text-gray-700">Sponsor companies</div>
        <CustomMultiSelect
          label="Sponsor companies"
          options={sponsorOptions}
          value={sponsorCompanyIds}
          onChange={(value) => setSponsorCompanyIds(value as string[])}
          search
          width="100%"
        />
      </div>
    </AppDialog>
  );
}
