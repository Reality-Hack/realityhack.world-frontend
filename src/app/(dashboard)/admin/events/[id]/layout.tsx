import { Tab } from '@/components/Tab';
import Loader from '@/components/Loader';
import { useAuth } from '@/contexts/AuthContext';
import {
  AdminEventProvider,
  useAdminEvent,
} from '@/contexts/AdminEventContext';
import { AppLink, useAppPathname } from '@/routing';

const isEventsEnabled = import.meta.env.VITE_IS_EVENTS_ENABLED === 'true';

function AdminEventDetailLayoutContent({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const pathname = useAppPathname();
  const { event, basePath, isLoading, activateEvent, formatEventDate } =
    useAdminEvent();

  if (isLoading) {
    return <Loader />;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="h-screen p-6 pt-8 pl-2">
      <AppLink href="/admin/events" className="text-sm text-gray-500 hover:text-themePrimary">
        ← Back to events
      </AppLink>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl">{event.name}</h1>
          <div>{event.is_active ? 'Active Event' : 'Inactive'}</div>
          <div>
            {formatEventDate(event.start_date)} - {formatEventDate(event.end_date)}
          </div>
        </div>
        <button
          type="button"
          className={`rounded-md bg-blue-500 px-4 py-2 text-white ${event.is_active ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={event.is_active}
          onClick={() => void activateEvent()}
        >
          Activate
        </button>
      </div>
      <div className="py-4">
        <div className="pb-2">
          <Tab
            href={`${basePath}/application-questions`}
            isSelected={pathname === `${basePath}/application-questions`}
            title="Application Questions"
          />
          <Tab
            href={`${basePath}/rsvp-questions`}
            isSelected={pathname === `${basePath}/rsvp-questions`}
            title="RSVP Questions"
          />
          <Tab
            href={`${basePath}/prizes`}
            isSelected={pathname === `${basePath}/prizes`}
            title="Prizes"
          />
          <Tab
            href={`${basePath}/sponsors`}
            isSelected={pathname === `${basePath}/sponsors`}
            title="Sponsors"
          />
        </div>
        <hr className="dark:border-borderDark" />
      </div>
      {children}
    </div>
  );
}

export default function AdminEventDetailLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const { isAdmin } = useAuth();

  if (!isEventsEnabled) {
    return <div>Events are not enabled</div>;
  }

  if (!isAdmin) {
    return <div>You are not authorized to access this page</div>;
  }

  return (
    <AdminEventProvider>
      <AdminEventDetailLayoutContent>{children}</AdminEventDetailLayoutContent>
    </AdminEventProvider>
  );
}
