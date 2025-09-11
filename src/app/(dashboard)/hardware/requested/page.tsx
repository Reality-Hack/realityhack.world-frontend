'use client';
import HardwareRequestView from '@/components/HardwareRequestView'; 
import { LinearProgress } from '@mui/material';
import { useAuthContext } from '@/hooks/AuthContext';
import { HardwareProvider } from '@/contexts/HardwareAdminContext';

export default function RequestedHardware() {
  const { user } = useAuthContext();
  return !user ? (
    <LinearProgress />
  ) : (
    <HardwareProvider>
      <HardwareRequestView
        reasonEditable={true}
        deletable={true}
        requester={user.id}
      ></HardwareRequestView>
    </HardwareProvider>
  );
}
