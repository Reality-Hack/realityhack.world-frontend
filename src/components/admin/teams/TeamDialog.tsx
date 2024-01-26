'use client';
import { SerializedTeam } from '@/app/api/team';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import TeamForm from './TeamForm';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (newTeam: any) => void;
};

const defaultTeam: SerializedTeam = {
  id: '',
  name: '',
  attendees: [],
  table: undefined,
  created_at: '',
  updated_at: ''
};

export default function TeamDialog({ open, onClose, onSave }: Props) {
  const [team, setTeam] = useState<SerializedTeam>(defaultTeam);

  useEffect(() => {
    setTeam(defaultTeam);
  }, [open]);

  return (
    open && (
      <Dialog onClose={onClose} open={open} fullWidth={true} maxWidth="md">
        <DialogTitle>Create New Team</DialogTitle>
        <div className="p-4 flex flex-col h-full">
          <div className="inline">
            <TeamForm team={team} onChange={setTeam} />
          </div>
          <div className="flex-1" />
          <div className="m-2 flex gap-1">
            <div className="flex-1" />
            <button
              className="gap-1.5s flex mt-0 mb-4 bg-[#1677FF] text-white px-4 py-[6px] rounded-md shadow my-4 font-light text-sm hover:bg-[#0066F5] transition-all"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="gap-1.5s flex mt-0 mb-4 bg-[#1677FF] text-white px-4 py-[6px] rounded-md shadow my-4 font-light text-sm hover:bg-[#0066F5] transition-all"
              onClick={() => {
                let payload = {
                  name: team.name,
                  table: team.table?.id,
                  attendees: team.attendees.map(a => a.id)
                };
                onSave(payload);
              }}
            >
              Save
            </button>
          </div>
        </div>
      </Dialog>
    )
  );
}
