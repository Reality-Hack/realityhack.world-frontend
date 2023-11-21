import { getAllHackerApplications } from '@/app/api/application';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import HackerApplicationTable from '@/components/admin/applications/HackerApplicationTable';
import { Application } from '@/types/types';
import { Session, getServerSession } from 'next-auth';

export default async function Participants() {
  const session: Session | null = await getServerSession(authOptions);
  const isAdmin = session && session.roles?.includes('admin');
  let applications: Application[] = [];
  if (session?.access_token && isAdmin) {
    applications = await getAllHackerApplications(session.access_token);
  }

  return <HackerApplicationTable applications={applications} />;
}
