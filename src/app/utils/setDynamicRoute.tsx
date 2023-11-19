'use client';

import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function SetDynamicRoute(): JSX.Element | null {
  const router = useRouter();

  useEffect(() => {
    if (router && 'isReady' in router && !router.isReady) {
      redirect('/');
    }
  }, [router]);

  return <></>;
}
