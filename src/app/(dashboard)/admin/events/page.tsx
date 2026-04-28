import { useSession } from '@/auth/client';
import { useState } from 'react';
import { useEventsList, eventsActivateCreate, useApplicationquestionsList } from '@/types/endpoints'
import { Event } from '@/types/models'
import { DateTime } from 'luxon';
import Loader from '@/components/Loader';
import { toast } from 'sonner';
import Table from '@/components/Table';
import { AppLink } from '@/routing';
import { ColumnDef } from '@tanstack/react-table';
import AppButton from '@/components/common/AppButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CreateEventForm from '@/components/admin/events/CreateEventForm';

const isEventsEnabled = import.meta.env.VITE_IS_EVENTS_ENABLED === 'true';
export default function EventsAdminPage() {
  const { data: session } = useSession();
  const [createEventOpen, setCreateEventOpen] = useState(false);
	const { 
    data: events, 
    isLoading: isLoadingEvents,
    mutate: mutateEvents
  } = useEventsList({}, {
		swr: { enabled: !!session?.access_token },
	})

  const { 
    data: thematicQuestions, 
    isLoading: isThematicQuestionsLoading, 
    error: thematicQuestionsError,
    mutate: mutateThematicQuestions
  } = useApplicationquestionsList();

	const handleActivateEvent = async (eventId: string) => {
		await eventsActivateCreate(eventId);
    toast.success('Event activated successfully');
    mutateThematicQuestions();
    mutateEvents();
	}
	
	const formatDate = (date: string) => {
		return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_SHORT);
	}

	const columns: ColumnDef<Event>[] = [
		{
			header: 'Name',
			accessorKey: 'name',
		},
		{
			header: 'Start Date',
			accessorKey: 'start_date',
			cell: ({ row }) => formatDate(row.original.start_date),
		},
		{
			header: 'End Date',
			accessorKey: 'end_date',
			cell: ({ row }) => formatDate(row.original.end_date),
		},
		{
			header: 'Is Active',
			accessorKey: 'is_active',
			cell: ({ row }) => row.original.is_active ? 'Yes' : 'No',
		},
		{
			header: 'Actions',
			accessorKey: 'actions',
			cell: ({ row }) => (
				<AppLink href={`/admin/events/${row.original.id}`}>View</AppLink>
			),
		},
	]

  if (!isEventsEnabled) {
    return <div>Events are not enabled</div>;
  }

	if (isLoadingEvents) {
		return <Loader />
	}

	return (
		<div className="p-6">
    <div className="flex flex-row justify-between items-center">
      <h1 className="text-3xl">Events</h1>
      <AppButton onClick={() => setCreateEventOpen(true)}>
        Create Event
      </AppButton>
    </div>

      <Dialog
        open={createEventOpen}
        onClose={() => setCreateEventOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create event</DialogTitle>
        <DialogContent className="pt-2">
          <CreateEventForm
            onCancel={() => setCreateEventOpen(false)}
            onSuccess={() => {
              setCreateEventOpen(false);
              void mutateEvents();
            }}
          />
        </DialogContent>
      </Dialog>

      <Table
        data={events ?? []}
        columns={columns}
        search={true}
        pagination={true}
        loading={isLoadingEvents}
      />
		</div>
	)
}