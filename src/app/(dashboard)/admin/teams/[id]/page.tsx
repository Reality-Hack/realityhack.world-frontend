'use client';

import {
  SerializedTeam,
  deleteTeam,
  getTeam,
  updateTeam
} from '@/app/api/team';
import TeamForm from '@/components/admin/teams/TeamForm';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import { Button } from 'antd';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function TeamPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const isAdmin = session && session.roles?.includes('admin');
  const [team, setTeam] = useState<SerializedTeam>();
  const [origTeam, setOrigTeam] = useState<SerializedTeam>();
  const [success, setSuccess] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const router = useRouter();

  const getData = useCallback(async () => {
    if (isAdmin && session?.access_token) {
      const result = await getTeam(params.id, session?.access_token);
      setTeam(result);
      setOrigTeam(result);
    }
  }, [params]);

  const saveTeam = useCallback(async () => {
    if (isAdmin && session?.access_token && !!team) {
      const data: any = {
        name: team.name,
        table: team.table?.id,
        attendees: team.attendees.map(attendee => attendee.id)
      };
      const result = await updateTeam(params.id, data, session?.access_token);
      if (result) {
        setSuccess(true);
        setOrigTeam(team);
      }
    }
  }, [params, team]);

  const handleClose = () => setSuccess(false);

  const handleDeleteClose = () => setOpenDelete(false);

  const onDelete = async () => {
    if (isAdmin && session?.access_token) {
      await deleteTeam(params.id, session.access_token);
      router.replace('/admin/teams');
    }
  };

  const resetTeam = () => {
    setTeam(origTeam);
  };

  useEffect(() => {
    getData();
  }, [params, getData]);

  return (
    <div className="p-6 pt-8 pl-2">
      <h1 className="text-3xl">Team: {team?.name}</h1>
      <div className="py-4">
        {team && <TeamForm team={team} onChange={setTeam} />}
        <div className="m-2 float-right flex gap-1">
          <button
            className="gap-1.5s flex mt-0 mb-4 bg-[#1677FF] text-white px-4 py-[6px] rounded-md shadow my-4 font-light text-sm hover:bg-[#0066F5] transition-all"
            onClick={resetTeam}
          >
            Reset
          </button>
          <button
            className="gap-1.5s flex mt-0 mb-4 bg-red-600 hover:bg-red-700 text-white px-4 py-[6px] rounded-md shadow my-4 font-light text-sm transition-all"
            onClick={() => setOpenDelete(true)}
          >
            Delete
          </button>
          <button
            className="gap-1.5s flex mt-0 mb-4 bg-[#1677FF] text-white px-4 py-[6px] rounded-md shadow my-4 font-light text-sm hover:bg-[#0066F5] transition-all"
            onClick={saveTeam}
          >
            Save
          </button>
        </div>
      </div>
      <Dialog
        open={openDelete}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this team? It cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button onClick={onDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Team updated successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}
