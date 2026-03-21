import { useEffect } from 'react';
import { useAppNavigate } from '@/routing';

export default function Hardware() {
  const router = useAppNavigate();
  useEffect(() => {
    router.replace('/hardware/request');
  }, [router]);
  return null;
}
