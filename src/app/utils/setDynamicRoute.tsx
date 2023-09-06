"use client"

import { useEffect } from 'react';
import { useRouter, redirect } from 'next/navigation';

export function SetDynamicRoute(): JSX.Element | null {
  const router = useRouter();

  useEffect(() => {
    if (router && 'isReady' in router && !router.isReady) {
      redirect('/dashboard');
    }
  }, [router]);
  
  

  return <></>;
}
