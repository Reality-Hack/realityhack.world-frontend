import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';

export interface NavItem {
  href: string;
  title: string;
  icon: string;
}

export interface NavItems {
  navItems: NavItem[];
  availableRoutes: string[];
}

const isHomeEnabled = process.env.NEXT_PUBLIC_IS_HOME_ENABLED === 'true';
const isAdminEnabled = process.env.NEXT_PUBLIC_IS_ADMIN_ENABLED === 'true';
const isScheduleEnabled = process.env.NEXT_PUBLIC_IS_SCHEDULE_ENABLED === 'true';
const isSponsorDashboardEnabled = process.env.NEXT_PUBLIC_IS_SPONSOR_DASHBOARD_ENABLED === 'true';
const isShowcaseEnabled = process.env.NEXT_PUBLIC_IS_SHOWCASE_ENABLED === 'true';
const isTracksEnabled = process.env.NEXT_PUBLIC_IS_TRACKS_ENABLED === 'true';
const isHardwareCheckoutEnabled = process.env.NEXT_PUBLIC_IS_HARDWARE_CHECKOUT_ENABLED === 'true';
const isTeamsEnabled = process.env.NEXT_PUBLIC_IS_TEAMS_ENABLED === 'true';
const isHackerHelpEnabled = process.env.NEXT_PUBLIC_IS_HACKER_HELP_ENABLED === 'true';
const isMentorHelpEnabled = process.env.NEXT_PUBLIC_IS_MENTOR_HELP_ENABLED === 'true';
const isWorkshopsEnabled = process.env.NEXT_PUBLIC_IS_WORKSHOPS_ENABLED === 'true';
const isResourcesTabEnabled = process.env.NEXT_PUBLIC_IS_RESOURCES_TAB_ENABLED === 'true';
const isEventGuideEnabled = process.env.NEXT_PUBLIC_IS_EVENT_GUIDE_ENABLED === 'true';
const isSettingsTabEnabled = process.env.NEXT_PUBLIC_IS_SETTINGS_TAB_ENABLED === 'true';
const isHackersMetEnabled = process.env.NEXT_PUBLIC_IS_HACKERS_MET_ENABLED === 'true';
const isLighthousesEnabled = process.env.NEXT_PUBLIC_IS_LIGHTHOUSES_ENABLED === 'true';

export default function useNavigationAccess(): NavItems {
  const { 
    isAdmin, 
    canAccessSponsor, 
    canAccessMentor, 
    canAccessParticipant, 
    session
  } = useAuth();

  const navItems = useMemo(() => {
    let navItems: NavItem[] = []
    if (isHomeEnabled) {
      navItems.push({
        href: '/',
        title: 'Home',
        icon: '/icons/dashboard/home.svg'
      })
    }
    if (isAdmin && isAdminEnabled) {
      navItems.push({
        href: '/admin',
        title: 'Admin',
        icon: '/icons/dashboard/admin.svg'
      })
    }
    if (canAccessSponsor && isSponsorDashboardEnabled) {
      navItems.push({
        href: '/sponsor',
        title: 'Sponsor',
        icon: '/icons/dashboard/hardware.svg'
      })
    }
    if (canAccessMentor && isMentorHelpEnabled) {
      navItems.push({
        href: '/mentors',
        title: `Help Queue ${isAdmin ? '(Mentor)' : ''}`,
        icon: '/icons/dashboard/help.svg'
      })
    }
    if (isScheduleEnabled) {
      navItems.push({
        href: '/schedule',
        title: 'Schedule',
        icon: '/icons/dashboard/schedule.svg'
      })
    }
    if (isWorkshopsEnabled && (canAccessMentor || canAccessParticipant)) {
      navItems.push({
        href: '/workshops/schedule',
        title: 'Workshops',
        icon: '/icons/dashboard/workshops.svg'
      })
    }
    if (isHackersMetEnabled && canAccessParticipant) {
      navItems.push({
        href: '/team-formation/hackers-met',
        title: 'Team Formation',
        icon: '/icons/dashboard/team.svg'
      })
    }
    if (canAccessParticipant && isTeamsEnabled) {
      navItems.push({
        href: '/team',
        title: 'My Team',
        icon: '/icons/dashboard/team.svg'
      })
    }
    if (canAccessParticipant && isHackerHelpEnabled) {
      navItems.push({
        href: '/help',
        title: 'Help Queue',
        icon: '/icons/dashboard/help.svg'
      })
    }
    if (isLighthousesEnabled && canAccessMentor) {
      navItems.push({
        href: '/lighthouses',
        title: 'Lighthouses',
        icon: '/icons/dashboard/lighthouse.svg'
      })
    }
    if (isHardwareCheckoutEnabled && canAccessParticipant) {
      navItems.push({
        href: '/hardware/request',
        title: 'Hardware',
        icon: '/icons/dashboard/hardware.svg'
      })
    }
    if (isShowcaseEnabled) {
      navItems.push({
        href: '/showcase',
        title: 'Showcase',
        icon: '/icons/dashboard/showcase.svg'
      })
    }
    if (isTracksEnabled) {
      navItems.push({
        href: '/tracks',
        title: 'Prizes / Tracks',
        icon: '/icons/dashboard/tracks.svg'
      })
    }
    if (isResourcesTabEnabled) {
      navItems.push({
        href: '/resources',
        title: 'Resources',
        icon: '/icons/dashboard/resources.svg'
      })
    }
    if (isEventGuideEnabled) {
      navItems.push({
        href: '/guide',
        title: 'Event Guide',
        icon: '/icons/dashboard/guide.svg'
      })
    }
    if (isSettingsTabEnabled) {
      navItems.push({
        href: '/settings',
        title: 'Settings',
        icon: '/icons/dashboard/settings.svg'
      })
    }
    return navItems
  }, [session])
  const availableRoutes = useMemo(() => {
    return navItems.map(item => item.href)
      .map(route => {
        const segments = route.split('/');
        return segments.length > 2 ? `/${segments[1]}` : route;
      });
  }, [navItems]);
  return {
    navItems,
    availableRoutes
  }
}