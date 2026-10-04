import { useAuth } from '@/contexts/AuthContext';
import { Capability } from '@/lib/access/capabilities';
import { useMemo } from 'react';

export interface NavItem {
  href: string;
  title: string;
  icon: string;
}

export interface NavItems {
  navItems: NavItem[];
}

interface NavTitleContext {
  isAdmin: boolean;
}

interface NavItemDefinition extends Omit<NavItem, 'title'> {
  title: string | ((context: NavTitleContext) => string);
  /** Gate for the link; the subtree it lands in is gated by ROUTE_POLICIES. */
  capability: Capability;
}

/**
 * The sidebar is a projection of the user's capabilities, not a source of
 * authorization — route reachability lives in lib/access/routePolicies.
 */
const NAV_ITEM_DEFINITIONS: readonly NavItemDefinition[] = [
  {
    href: '/',
    title: 'Home',
    icon: '/icons/dashboard/home.svg',
    capability: 'home.view',
  },
  {
    href: '/admin',
    title: 'Admin',
    icon: '/icons/dashboard/admin.svg',
    capability: 'admin.dashboard',
  },
  {
    href: '/sponsor',
    title: 'Sponsor',
    icon: '/icons/dashboard/hardware.svg',
    capability: 'sponsor.view',
  },
  {
    href: '/mentors',
    title: ({ isAdmin }) => `Help Queue ${isAdmin ? '(Mentor)' : ''}`,
    icon: '/icons/dashboard/help.svg',
    capability: 'mentors.view',
  },
  {
    href: '/schedule',
    title: 'Schedule',
    icon: '/icons/dashboard/schedule.svg',
    capability: 'schedule.view',
  },
  {
    href: '/workshops/schedule',
    title: 'Workshops',
    icon: '/icons/dashboard/workshops.svg',
    capability: 'workshops.view',
  },
  {
    href: '/team-formation/hackers-met',
    title: 'Team Formation',
    icon: '/icons/dashboard/team.svg',
    capability: 'teamFormation.view',
  },
  {
    href: '/team',
    title: 'My Team',
    icon: '/icons/dashboard/team.svg',
    capability: 'team.view',
  },
  {
    href: '/help',
    title: 'Help Queue',
    icon: '/icons/dashboard/help.svg',
    capability: 'help.view',
  },
  {
    href: '/lighthouses',
    title: 'Lighthouses',
    icon: '/icons/dashboard/lighthouse.svg',
    capability: 'lighthouses.view',
  },
  {
    href: '/hardware/request',
    title: 'Hardware',
    icon: '/icons/dashboard/hardware.svg',
    capability: 'hardware.view',
  },
  {
    href: '/showcase',
    title: 'Showcase',
    icon: '/icons/dashboard/showcase.svg',
    capability: 'showcase.view',
  },
  {
    href: '/tracks',
    title: 'Prizes / Tracks',
    icon: '/icons/dashboard/tracks.svg',
    capability: 'tracks.view',
  },
  {
    href: '/resources',
    title: 'Resources',
    icon: '/icons/dashboard/resources.svg',
    capability: 'resources.view',
  },
  {
    href: '/guide',
    title: 'Event Guide',
    icon: '/icons/dashboard/guide.svg',
    capability: 'guide.view',
  },
  {
    href: '/settings',
    title: 'Settings',
    icon: '/icons/dashboard/settings.svg',
    capability: 'settings.view',
  },
];

export default function useNavigationAccess(): NavItems {
  const { capabilities, isAdmin } = useAuth();

  const navItems = useMemo(
    () =>
      NAV_ITEM_DEFINITIONS.filter((item) => capabilities.has(item.capability)).map(
        ({ href, icon, title }) => ({
          href,
          icon,
          title: typeof title === 'function' ? title({ isAdmin }) : title,
        }),
      ),
    [capabilities, isAdmin],
  );

  return { navItems };
}
