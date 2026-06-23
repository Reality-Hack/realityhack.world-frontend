import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
  sponsoreventengagementsCreate,
  sponsoreventengagementsPartialUpdate,
} from '@/types/endpoints';
import { Sponsor, SponsorEventEngagement, TierEnum } from '@/types/models';
import { useEvents } from '@/contexts/EventContext';
import { SponsorTierSelect } from './SponsorTierSelect';
import AppDialog from '@/components/common/AppDialog';

export type SponsorRow = Sponsor & { engagement: SponsorEventEngagement | undefined };

type EngagementDialogProps = {
  showDialog: boolean;
  sponsor: Sponsor | null;
  engagement: SponsorEventEngagement | null;
  eventId?: string;
  sponsorOptions?: Sponsor[];
  onClose: () => void;
  onSuccess: () => void;
};

export function EngagementDialog({
  showDialog,
  sponsor,
  engagement,
  eventId,
  sponsorOptions,
  onClose,
  onSuccess,
}: EngagementDialogProps): JSX.Element {
  const [selectedSponsorId, setSelectedSponsorId] = useState<string>(
    sponsor?.id ?? engagement?.sponsor ?? '',
  );
  const [tier, setTier] = useState<TierEnum | ''>(engagement?.tier ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedEvent } = useEvents();
  const resolvedEventId = eventId ?? selectedEvent?.id ?? '';
  const showSponsorSelect = !sponsor && !!sponsorOptions?.length;
  const eventRequestOptions = resolvedEventId
    ? { params: { event: resolvedEventId } }
    : undefined;

  useEffect(() => {
    if (showDialog) {
      setSelectedSponsorId(sponsor?.id ?? engagement?.sponsor ?? '');
      setTier(engagement?.tier ?? '');
    }
  }, [showDialog, sponsor, engagement]);

  const handleSubmit = async (): Promise<void> => {
    const resolvedSponsorId = sponsor?.id ?? selectedSponsorId;

    if (!resolvedSponsorId) {
      toast.error('Please select a sponsor');
      return;
    }

    if (!resolvedEventId) {
      toast.error('No event selected');
      return;
    }

    setIsSubmitting(true);
    try {
      if (engagement?.id) {
        await sponsoreventengagementsPartialUpdate(
          engagement.id,
          {
            tier: tier || null,
          },
          eventRequestOptions,
        );
      } else {
        await sponsoreventengagementsCreate(
          {
            tier: tier || null,
            sponsor: resolvedSponsorId,
            event: resolvedEventId,
          },
          eventRequestOptions,
        );
      }
      toast.success('Engagement saved');
      onSuccess();
      onClose();
    } catch {
      toast.error('Failed to save engagement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUpdate = !!engagement;
  const dialogTitle = isUpdate
    ? `Update tier for ${sponsor?.name ?? 'sponsor'}`
    : sponsor
      ? `Add ${sponsor.name} to event`
      : 'Add sponsor to event';

  return (
    <AppDialog
      showDialog={showDialog}
      onClose={onClose}
      title={dialogTitle}
      onSubmit={() => void handleSubmit()}
      isSubmitting={isSubmitting}
    >
      <div className="flex flex-col gap-2">
        {showSponsorSelect ? (
          <>
            <label className="text-xs/8">SPONSOR</label>
            <FormControl fullWidth margin="normal">
              <InputLabel id="engagement-sponsor-label">Sponsor</InputLabel>
              <Select
                labelId="engagement-sponsor-label"
                value={selectedSponsorId}
                label="Sponsor"
                onChange={(e: SelectChangeEvent) =>
                  setSelectedSponsorId(e.target.value)
                }
              >
                {sponsorOptions?.map((option) =>
                  option.id ? (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ) : null,
                )}
              </Select>
            </FormControl>
          </>
        ) : null}
        <label className="text-xs/8">SPONSOR TIER</label>
        <SponsorTierSelect value={tier} onChange={setTier} />
      </div>
    </AppDialog>
  );
}
