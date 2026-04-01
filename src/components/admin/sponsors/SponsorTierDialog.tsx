import { useState } from 'react';
import { toast } from 'sonner';
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
  sponsor: Sponsor;
  engagement: SponsorEventEngagement | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function EngagementDialog({ showDialog, sponsor, engagement, onClose, onSuccess }: EngagementDialogProps) {
  const [tier, setTier] = useState<TierEnum | ''>(engagement?.tier ?? '');  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedEvent } = useEvents();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (engagement?.id) {
        await sponsoreventengagementsPartialUpdate(engagement.id, {
          tier: tier || null,
        });
      } else {
        await sponsoreventengagementsCreate({
          tier: tier || null,
          sponsor: sponsor.id!,
          event: selectedEvent?.id ?? '',
        });
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

  return (
    <AppDialog showDialog={showDialog} onClose={onClose} title={isUpdate ? 'Update Tier for' : 'Add to Event'} onSubmit={() => handleSubmit()} isSubmitting={isSubmitting}>
      <div className="flex flex-col gap-2">
        <label className="text-xs/8">SPONSOR TIER</label>
        <SponsorTierSelect value={tier} onChange={setTier} />
      </div>
    </AppDialog>
  );
}
