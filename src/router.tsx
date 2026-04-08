import { createBrowserRouter, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AuthContent from '@/components/AuthContent';
import Loader from '@/components/Loader';

// Eagerly loaded (small, always needed)
import SignIn from '@/app/signin/page';
import Dashboard from '@/app/page';

// Layouts (kept as children-based wrappers; Outlet is passed as children)
import WorkshopsLayout from '@/app/(dashboard)/workshops/layout';
import HardwareLayout from '@/app/(dashboard)/hardware/layout';
import TeamFormationLayout from '@/app/(dashboard)/team-formation/layout';
import AdminLayout from '@/app/(dashboard)/admin/layout';
import AdminSponsorsLayout from '@/app/(dashboard)/admin/sponsors/layout';
import AdminHardwareLayout from '@/app/(dashboard)/admin/hardware/layout';
import AdminRsvpLayout from '@/app/(dashboard)/admin/rsvp/layout';
import AdminApplicationsLayout from '@/app/(dashboard)/admin/applications/layout';
import AdminUsersLayout from '@/app/(dashboard)/admin/users/layout';

// Lazy-loaded pages
const ApplyPage = lazy(() => import('@/app/apply/page'));
const JudgeApp = lazy(() => import('@/app/apply/judge/page'));
const MentorApp = lazy(() => import('@/app/apply/mentor/page'));
const RsvpForm = lazy(() => import('@/app/rsvp/[...slug]/page'));

const SchedulePage = lazy(() => import('@/app/(dashboard)/schedule/page'));
const TracksPage = lazy(() => import('@/app/(dashboard)/tracks/page'));
const ResourcesPage = lazy(() => import('@/app/(dashboard)/resources/page'));
const ShowcasePage = lazy(() => import('@/app/(dashboard)/showcase/page'));
const SettingsPage = lazy(() => import('@/app/(dashboard)/settings/page'));
const LighthousesPage = lazy(() => import('@/app/(dashboard)/lighthouses/page'));
const TeamPage = lazy(() => import('@/app/(dashboard)/team/page'));
const GuidePage = lazy(() => import('@/app/(dashboard)/guide/page'));
const HelpPage = lazy(() => import('@/app/(dashboard)/help/page'));
const MentorsPage = lazy(() => import('@/app/(dashboard)/mentors/page'));
const SponsorPage = lazy(() => import('@/app/(dashboard)/sponsor/page'));

const WorkshopsSchedule = lazy(() => import('@/app/(dashboard)/workshops/schedule/page'));
const WorkshopsMySchedule = lazy(() => import('@/app/(dashboard)/workshops/my-schedule/page'));

const HardwareIndex = lazy(() => import('@/app/(dashboard)/hardware/page'));
const HardwareRequest = lazy(() => import('@/app/(dashboard)/hardware/request/page'));
const HardwareRequested = lazy(() => import('@/app/(dashboard)/hardware/requested/page'));

const TeamFormationHackersMet = lazy(() => import('@/app/(dashboard)/team-formation/hackers-met/page'));
const TeamFormationInterests = lazy(() => import('@/app/(dashboard)/team-formation/interests/page'));
const TeamFormationProfile = lazy(() => import('@/app/(dashboard)/team-formation/profile/page'));
const TeamFormationRoundOne = lazy(() => import('@/app/(dashboard)/team-formation/round-one/page'));
const TeamFormationRoundTwo = lazy(() => import('@/app/(dashboard)/team-formation/round-two/page'));
const TeamFormationRoundThree = lazy(() => import('@/app/(dashboard)/team-formation/round-three/page'));
const TeamFormationFinalTeam = lazy(() => import('@/app/(dashboard)/team-formation/final-team/page'));

const AdminDashboard = lazy(() => import('@/app/(dashboard)/admin/page'));
const AdminCheckin = lazy(() => import('@/app/(dashboard)/admin/checkin/page'));
const AdminEvents = lazy(() => import('@/app/(dashboard)/admin/events/page'));
const AdminEventsDetail = lazy(() => import('@/app/(dashboard)/admin/events/[id]/page'));
const AdminMarkdown = lazy(() => import('@/app/(dashboard)/admin/markdown/page'));
const AdminWorkshops = lazy(() => import('@/app/(dashboard)/admin/workshops/page'));
const AdminTeams = lazy(() => import('@/app/(dashboard)/admin/teams/page'));
const AdminTeamDetail = lazy(() => import('@/app/(dashboard)/admin/teams/[id]/page'));
const AdminSponsors = lazy(() => import('@/app/(dashboard)/admin/sponsors/page'));
const AdminSponsorDetail = lazy(() => import('@/app/(dashboard)/admin/sponsors/[id]/page'));

const AdminHardwareIndex = lazy(() => import('@/app/(dashboard)/admin/hardware/page'));
const AdminHardwareRequests = lazy(() => import('@/app/(dashboard)/admin/hardware/requests/page'));
const AdminHardwareCheckout = lazy(() => import('@/app/(dashboard)/admin/hardware/checkout/page'));

const AdminRsvpParticipants = lazy(() => import('@/app/(dashboard)/admin/rsvp/participants/page'));
const AdminRsvpMentors = lazy(() => import('@/app/(dashboard)/admin/rsvp/mentors/page'));
const AdminRsvpJudges = lazy(() => import('@/app/(dashboard)/admin/rsvp/judges/page'));
const AdminRsvpVolunteers = lazy(() => import('@/app/(dashboard)/admin/rsvp/volunteers/page'));
const AdminRsvpSponsors = lazy(() => import('@/app/(dashboard)/admin/rsvp/sponsors/page'));
const AdminRsvpOrganizers = lazy(() => import('@/app/(dashboard)/admin/rsvp/organizers/page'));

const AdminApplicationsParticipants = lazy(() => import('@/app/(dashboard)/admin/applications/participants/page'));
const AdminApplicationsMentors = lazy(() => import('@/app/(dashboard)/admin/applications/mentors/page'));
const AdminApplicationsJudges = lazy(() => import('@/app/(dashboard)/admin/applications/judges/page'));
const AdminApplicationsVolunteers = lazy(() => import('@/app/(dashboard)/admin/applications/volunteers/page'));

const AdminUsersParticipants = lazy(() => import('@/app/(dashboard)/admin/users/participants/page'));
const AdminUsersMentors = lazy(() => import('@/app/(dashboard)/admin/users/mentors/page'));
const AdminUsersJudges = lazy(() => import('@/app/(dashboard)/admin/users/judges/page'));

const Loading = () => <Loader />;

/** Root layout — replaces src/app/layout.tsx. */
function RootLayout() {
  return (
    <AuthContent>
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </AuthContent>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'signin', element: <SignIn /> },
      { path: 'apply', element: <ApplyPage /> },
      { path: 'apply/judge', element: <JudgeApp /> },
      { path: 'apply/mentor', element: <MentorApp /> },
      { path: 'rsvp/*', element: <RsvpForm /> },

      // Simple dashboard pages
      { path: 'schedule', element: <SchedulePage /> },
      { path: 'tracks', element: <TracksPage /> },
      { path: 'resources', element: <ResourcesPage /> },
      { path: 'showcase', element: <ShowcasePage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'lighthouses', element: <LighthousesPage /> },
      { path: 'team', element: <TeamPage /> },
      { path: 'guide', element: <GuidePage /> },
      { path: 'help', element: <HelpPage /> },
      { path: 'mentors', element: <MentorsPage /> },
      { path: 'sponsor', element: <SponsorPage /> },

      // Workshops (tabbed layout)
      {
        path: 'workshops',
        element: <WorkshopsLayout><Outlet /></WorkshopsLayout>,
        children: [
          { path: 'schedule', element: <WorkshopsSchedule /> },
          { path: 'my-schedule', element: <WorkshopsMySchedule /> },
        ],
      },

      // Hardware (tabbed layout)
      {
        path: 'hardware',
        element: <HardwareLayout><Outlet /></HardwareLayout>,
        children: [
          { index: true, element: <HardwareIndex /> },
          { path: 'request', element: <HardwareRequest /> },
          { path: 'requested', element: <HardwareRequested /> },
        ],
      },

      // Team formation (tabbed layout)
      {
        path: 'team-formation',
        element: <TeamFormationLayout><Outlet /></TeamFormationLayout>,
        children: [
          { path: 'hackers-met', element: <TeamFormationHackersMet /> },
          { path: 'interests', element: <TeamFormationInterests /> },
          { path: 'profile', element: <TeamFormationProfile /> },
          { path: 'round-one', element: <TeamFormationRoundOne /> },
          { path: 'round-two', element: <TeamFormationRoundTwo /> },
          { path: 'round-three', element: <TeamFormationRoundThree /> },
          { path: 'final-team', element: <TeamFormationFinalTeam /> },
        ],
      },

      // Admin (EventParticipantsProvider wrapper)
      {
        path: 'admin',
        element: <AdminLayout><Outlet /></AdminLayout>,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'checkin', element: <AdminCheckin /> },
          { path: 'events', element: <AdminEvents /> },
          { path: 'events/:id', element: <AdminEventsDetail /> },
          { path: 'markdown', element: <AdminMarkdown /> },
          { path: 'workshops', element: <AdminWorkshops /> },
          { path: 'teams', element: <AdminTeams /> },
          { path: 'teams/:id', element: <AdminTeamDetail /> },
          {
            path: 'sponsors',
            element: <AdminSponsorsLayout><Outlet /></AdminSponsorsLayout>,
            children: [
              { index: true, element: <AdminSponsors /> },
              { path: ':id', element: <AdminSponsorDetail /> },
            ],
          },
          // Admin hardware (tabbed layout)
          {
            path: 'hardware',
            element: <AdminHardwareLayout><Outlet /></AdminHardwareLayout>,
            children: [
              { index: true, element: <AdminHardwareIndex /> },
              { path: 'requests', element: <AdminHardwareRequests /> },
              { path: 'checkout', element: <AdminHardwareCheckout /> },
            ],
          },

          // Admin RSVP (tabbed layout)
          {
            path: 'rsvp',
            element: <AdminRsvpLayout><Outlet /></AdminRsvpLayout>,
            children: [
              { path: 'participants', element: <AdminRsvpParticipants /> },
              { path: 'mentors', element: <AdminRsvpMentors /> },
              { path: 'judges', element: <AdminRsvpJudges /> },
              { path: 'volunteers', element: <AdminRsvpVolunteers /> },
              { path: 'sponsors', element: <AdminRsvpSponsors /> },
              { path: 'organizers', element: <AdminRsvpOrganizers /> },
            ],
          },

          // Admin applications (tabbed layout)
          {
            path: 'applications',
            element: <AdminApplicationsLayout><Outlet /></AdminApplicationsLayout>,
            children: [
              { path: 'participants', element: <AdminApplicationsParticipants /> },
              { path: 'mentors', element: <AdminApplicationsMentors /> },
              { path: 'judges', element: <AdminApplicationsJudges /> },
              { path: 'volunteers', element: <AdminApplicationsVolunteers /> },
            ],
          },

          // Admin users (tabbed layout)
          {
            path: 'users',
            element: <AdminUsersLayout><Outlet /></AdminUsersLayout>,
            children: [
              { path: 'participants', element: <AdminUsersParticipants /> },
              { path: 'mentors', element: <AdminUsersMentors /> },
              { path: 'judges', element: <AdminUsersJudges /> },
            ],
          },
        ],
      },
    ],
  },
]);
