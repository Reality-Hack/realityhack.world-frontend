'use client';
import HardwareRequestView from '@/components/HardwareRequestView'; 
import { LinearProgress } from '@mui/material';
import { useAuthContext } from '@/hooks/AuthContext';

export default function RequestedHardware() {
  const { user } = useAuthContext();
  return !user ? (
    <LinearProgress />
  ) : (
    <HardwareRequestView
      reasonEditable={true}
      deletable={true}
      requester={user.id}
    ></HardwareRequestView>
  );
}
