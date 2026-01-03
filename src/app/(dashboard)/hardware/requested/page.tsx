'use client';
import HardwareRequestTable from '@/components/HardwareRequestTable/HardwareRequestTable'; 
import { LinearProgress } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';

export default function RequestedHardware() {
  const { user } = useAuth();
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
