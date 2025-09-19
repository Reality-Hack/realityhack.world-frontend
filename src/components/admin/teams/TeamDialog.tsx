'use client';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import TeamForm from './TeamForm';
import { TeamOperationResult } from '@/types/types2';
import { useRouter } from 'next/navigation';

type Props = {
  open: boolean;
  onClose: () => void;
};
export default function TeamDialog({ open, onClose }: Props) {
  const router = useRouter();
  const handleSuccess = (result: TeamOperationResult | null) => {
    if (result && 'id' in result) {
      router.replace(`/admin/teams/${result.id as string}`);
    }
    onClose();
  };

  const handleError = (error: any) => {
    console.error('Team creation failed:', error);
  };

  return (
    open && (
      <Dialog onClose={onClose} open={open} fullWidth={true} maxWidth="md">
        <DialogTitle>Create New Team</DialogTitle>
        <div className="p-4 flex flex-col h-full">
          <div className="inline">
            <TeamForm
              onSuccess={handleSuccess}
              onError={handleError}
              onCancel={onClose}
            />
          </div>
        </div>
      </Dialog>
    )
  );
}
