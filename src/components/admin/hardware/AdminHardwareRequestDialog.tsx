'use client';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import AdminHardwareRequestForm from './AdminHardwareRequestForm';
import { AttendeeWithCheckIn } from '@/contexts/EventParticipantsContext';

type Props = {
  open: boolean;
  onClose: () => void;
  preselectedAttendee?: AttendeeWithCheckIn | null;
};

export default function AdminHardwareRequestDialog({ open, onClose, preselectedAttendee }: Props) {
  const handleSuccess = () => {
    onClose();
  };

  return (
    open && (
      <Dialog onClose={onClose} open={open} fullWidth={true} maxWidth="sm">
        <DialogTitle>Create Hardware Request</DialogTitle>
        <AdminHardwareRequestForm
          onSuccess={handleSuccess}
          onCancel={onClose}
          preselectedAttendee={preselectedAttendee}
        />
      </Dialog>
    )
  );
}
