import EventForm from '@/components/admin/events/EventForm';
import { useAdminEvent } from '@/contexts/AdminEventContext';

export default function AdminEventDetailsPage(): JSX.Element | null {
  const { event, mutateEvent, invalidateEventTabCaches } = useAdminEvent();

  if (!event) {
    return null;
  }

  return (
    <div className="max-w-2xl">
      <EventForm
        // Remount when switching events so the form re-initializes from the new event.
        key={event.id}
        event={event}
        onSuccess={(updated) => {
          void mutateEvent(updated, { revalidate: false });
          void invalidateEventTabCaches();
        }}
      />
    </div>
  );
}
