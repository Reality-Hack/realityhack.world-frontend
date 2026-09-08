import { Tab } from '../../../../components/Tab';
import { useAppPathname } from '@/routing';
import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ApplicationTable from '@/components/admin/applications/ApplicationTable';


export default function Hardware({ children }: { children: any }) {
  const pathname = useAppPathname();
  const { isAdmin, canSendRsvps } = useAuth();
  const pageTitle = useMemo(() => {
    if (pathname === '/admin/applications' || pathname === '/admin/applications/') {
      return 'Applications';
    }
    if (pathname == '/admin/applications/applications') {
      return 'Applications';
    }
    if (pathname == '/admin/applications/invites') {
      return 'Invites';
    }
    return 'Applications';
  }, [pathname]);
  if (!canSendRsvps) {
    return (
      <div className="h-screen p-6 pt-8 pl-2">
        <h1 className="text-3xl">Applications</h1>
        <div className="py-4">
          <ApplicationTable />
        </div>
      </div>
    )
  }
  else {
    return (
      <main>
        <h1 className="text-4xl">
          {pageTitle}
        </h1>
        <div className="py-4">
          <div className="pb-2">
            <Tab
              href="/admin/applications/applications"
              isSelected={pathname === '/admin/applications/applications' || pathname === '/admin/applications/'}
              title="Applications"
            ></Tab>
            <Tab
              href="/admin/applications/invites"
              isSelected={pathname == '/admin/applications/invites'}
              title="Invites"
            ></Tab>
          </div>
        </div>
        {children}
      </main>
    )
  }
}
