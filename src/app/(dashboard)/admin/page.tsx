import { AppLink as Link } from '@/routing';
import { useAuth } from '@/contexts/AuthContext';
import { Capability } from '@/lib/access/capabilities';

interface AdminTile {
  href: string;
  label: string;
  capability: Capability;
}

/**
 * Tiles are gated by the same capabilities as the routes they link to, so a
 * hidden tile is also an unreachable URL.
 */
const ADMIN_TILES: readonly AdminTile[] = [
  { href: '/admin/checkin', label: 'Check In', capability: 'admin.checkin' },
  { href: '/admin/rsvp/participants', label: 'Attendees', capability: 'admin.rsvp' },
  {
    href: '/admin/applications/applications',
    label: 'Applications',
    capability: 'admin.applications',
  },
  { href: '/admin/events', label: 'Events', capability: 'admin.events' },
  { href: '/admin/teams', label: 'Teams', capability: 'admin.teams' },
  { href: '/admin/hardware', label: 'Hardware', capability: 'admin.hardware' },
  { href: '/admin/workshops', label: 'Workshop check in', capability: 'admin.workshops' },
  { href: '/admin/sponsors', label: 'Sponsors', capability: 'admin.sponsors' },
];

const Dashboard = () => {
  const { can } = useAuth();

  return (
    <div className="h-screen">
      <h1 className="mt-6 mb-5 ml-6 text-3xl text">Admin Dashboard</h1>
      <div className="flex flex-wrap justify-center gap-6 ml-6 mt-14">
        {ADMIN_TILES.filter((tile) => can(tile.capability)).map((tile) => (
          <Link key={tile.href} href={tile.href}>
            <div className="flex-col gap-2 w-[355px] h-56 bg-gradient-to-t from-[#DBF0FB] to-[#DBF0FB] rounded-[10px] shadow flex justify-center items-center">
              <span className="text-xl text-center text-[#40337F]">{tile.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
