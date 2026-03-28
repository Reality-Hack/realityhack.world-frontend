/**
 * Navigation façade — all routing primitives go through this module.
 * Backed by react-router-dom.
 *
 * To add a new routing primitive, add it here; consumers import only from
 * '@/routing', never directly from 'react-router-dom' or 'next/*'.
 */

import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';
import type { ComponentPropsWithoutRef } from 'react';

/** Minimal navigate API used across the app. */
export interface AppNavigate {
  push: (path: string) => void;
  replace: (path: string) => void;
  back: () => void;
}

export function useAppNavigate(): AppNavigate {
  const navigate = useNavigate();
  return {
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
    back: () => navigate(-1),
  };
}

export function useAppPathname(): string {
  return useLocation().pathname;
}

/** Route params — use in pages that previously received `params` as props. */
export function useAppParams(): Record<string, string | undefined> {
  return useParams() as Record<string, string | undefined>;
}

/**
 * AppLink — maps the `href` prop convention (previously next/link) to
 * react-router-dom's `to` prop.
 */
export type AppLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href'> &
  Omit<LinkProps, 'to'> & {
    href: string;
  };

export function AppLink({ href, children, ...rest }: AppLinkProps) {
  return (
    <Link to={href} {...rest}>
      {children}
    </Link>
  );
}
