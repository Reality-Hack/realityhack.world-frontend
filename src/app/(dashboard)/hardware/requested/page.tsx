'use client';
import HardwareRequestView from '@/components/HardwareRequestView';
import { getMe } from '@/app/api/attendee';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { LinearProgress } from '@mui/material';
import { Attendee } from '@/types/types';

export default function RequestedHardware() {
  const { data: session } = useSession();
  const [me, setMe] = useState<Attendee | null>(null);
  useEffect(() => {
    getMe(session!.access_token).then(me => setMe(me));
  }, [session]);
  return me == null ? (
    <LinearProgress />
  ) : (
    <HardwareRequestView
      reasonEditable={true}
      deletable={true}
      requester={me.id}
    ></HardwareRequestView>
  );
}
