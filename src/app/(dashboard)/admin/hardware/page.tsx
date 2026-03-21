import { useEffect } from 'react';
import { useAppNavigate } from '@/routing';

export default function AdminHardware() {
  const router = useAppNavigate();
  useEffect(() => {
    router.replace('/admin/hardware/requests');
  }, [router]);
  return null;
}
