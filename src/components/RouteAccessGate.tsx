import { ReactNode } from 'react';
import useRouteAccess from '@/hooks/useRouteAccess';
import Loader from './Loader';

interface RouteAccessGateProps {
  children: ReactNode;
}

/**
 * Withholds the page until access is settled, so a denied page never mounts
 * and never fires its data hooks. NavGuard handles the redirect itself; this
 * only decides whether to render.
 *
 * Client-side routing is UX, not a security boundary — the API must enforce
 * the same rules.
 */
export const RouteAccessGate = ({ children }: RouteAccessGateProps) => {
  const { status } = useRouteAccess();

  if (status !== 'allowed') return <Loader />;

  return <>{children}</>;
};

export default RouteAccessGate;
