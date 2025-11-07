'use client';
import HardwareRequestTable from '@/components/HardwareRequestTable/HardwareRequestTable'; 
import { LinearProgress } from '@mui/material';
import { useAuthContext } from '@/hooks/AuthContext';

export default function RequestedHardware() {
  const { user } = useAuthContext();
  return !user ? (
    <LinearProgress />
  ) : (
      <HardwareRequestTable
        reasonEditable={true}
        deletable={true}
        requester={user.id}
      />
  );
}
