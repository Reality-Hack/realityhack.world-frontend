'use client';
import TeamDialog from '@/components/admin/teams/TeamDialog';
import TeamTable from '@/components/admin/teams/TeamTable';
import { Alert } from '@mui/material';
import { useState } from 'react';

export default function TeamListPage() {
  const [open, setOpen] = useState<boolean>(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState('');

  return (
    <main className="pl-2 pt-8">
      <div className="flex">
        <h1 className="text-3xl">Teams</h1>
        <div className="flex-1" />
        <button
          className="gap-1.5s flex mt-0 mb-4 bg-[#1677FF] text-white px-4 py-[6px] rounded-md shadow my-4 font-light text-sm hover:bg-[#0066F5] transition-all"
          onClick={() => setOpen(true)}
        >
          Create Team
        </button>
      </div>
      <TeamTable />

      <TeamDialog
        open={open}
        onClose={() => setOpen(false)}
      />
      {showErrorAlert && (
        <div
          className={`fixed top-0 left-0 m-4 z-[1001] transition-opacity w-[500px] ${
            showErrorAlert ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <Alert
            severity="error"
            onClose={() => {
              setShowErrorAlert(false);
            }}
          >
            {errorAlertMessage}
          </Alert>
        </div>
      )}
    </main>
  );
}
