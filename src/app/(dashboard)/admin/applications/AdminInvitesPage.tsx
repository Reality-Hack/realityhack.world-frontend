import {
  useApplicationsList,
  useApplicationsQueueRsvpEmailsCreate,
} from '@/types/endpoints';
import {
  ApplicationDetail,
  ApplicationsListParticipationClass,
  ApplicationsListStatus,
} from '@/types/models';
import { useSession } from '@/auth/client';
import Table from '@/components/Table';
import {
  ColumnDef,
  Row,
  RowSelectionState,
  createColumnHelper
} from '@tanstack/react-table';
import { INVITE_FILTER_SETS, INVITE_FILTER_KEYS, type InviteFilterKey } from './inviteFilterSets';
import { formatDateTime } from '@/app/utils/dateUtils';
import { useState, useMemo, useEffect, HTMLProps, useRef, useCallback } from 'react';
import AppButton from '@/components/common/AppButton';
import { toast } from 'sonner';

export default function AdminInvitesPage() {
  const [activeFilter, setActiveFilter] = useState<InviteFilterKey>('unsent');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { data: session } = useSession();
  const {
    data: applications,
    isLoading: isLoadingApplications,
    mutate: revalidateApplications
  } = useApplicationsList(INVITE_FILTER_SETS[activeFilter].params, {
    swr: { enabled: !!session?.access_token }
  });
  const selectedIds = useMemo(
    () => Object.keys(rowSelection).filter(id => rowSelection[id]),
    [rowSelection]
  );

  const { trigger: queueEmails, isMutating: isQueueing } = useApplicationsQueueRsvpEmailsCreate({
    request: { headers: { Authorization: `Bearer ${session?.access_token}` } },
  });

  const handleQueueEmails = useCallback(async () => {
    try {
      await queueEmails({ application_ids: selectedIds, resend: activeFilter === 'unaccepted' ? true : false });
      toast.success(`Queued ${selectedIds.length} RSVP email${selectedIds.length !== 1 ? 's' : ''}`);
      setRowSelection({});
      revalidateApplications();
    } catch {
      toast.error('Failed to queue emails. Please try again.');
    }
  }, [queueEmails, revalidateApplications, selectedIds]);

  const getMappedPartipationClass = useCallback((participationClass: ApplicationsListParticipationClass) => {
    switch (participationClass) {
      case ApplicationsListParticipationClass.P:
        return 'Participant';
      case ApplicationsListParticipationClass.M:
        return 'Mentor';
      case ApplicationsListParticipationClass.J:
        return 'Judge';
      case ApplicationsListParticipationClass.S:
        return 'Sponsor';
      default:
        return 'N/A';
    }
  }, []);

  const getMappedApplicationStatus = useCallback((status: ApplicationsListStatus) => {
    switch (status) {
      case ApplicationsListStatus.A:
        return 'Approved';
      case ApplicationsListStatus.D:
        return 'Denied';
      case ApplicationsListStatus.W:
        return 'Waitlisted';
      default:
        return 'N/A';
    }
  }, []);
  const columnHelper = createColumnHelper<ApplicationDetail>();
  const columns = useMemo<ColumnDef<ApplicationDetail, any>[]>(
    () => [
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <IndeterminateCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            onClick={e => e.stopPropagation()}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
              onClick={e => e.stopPropagation()}
            />
          </div>
        ),
        enableSorting: false
      }),
      columnHelper.accessor('first_name', {
        header: () => 'First Name',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('last_name', {
        header: () => 'Last Name',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('email', {
        header: () => 'Email',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('status', {
        header: () => 'Status',
        cell: info => getMappedApplicationStatus(info.getValue())
      }),
      columnHelper.accessor('participation_class', {
        header: () => 'Participation Class',
        cell: info => getMappedPartipationClass(info.getValue()),
      }),
      columnHelper.accessor('rsvp_email_sent_at', {
        header: () => 'RSVP Sent at',
        cell: info => formatDateTime(info.getValue())
      }),
    ], []);
  return (
    <div className="h-screen p-6 pt-8 pl-2">
      <h1 className="text-3xl">Event Invites</h1>
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <div className="flex gap-0 my-4 w-fit rounded overflow-hidden">
          {INVITE_FILTER_KEYS.map((key, i) => (
            <label
              key={key}
              className={[
                'flex items-center justify-center gap-2 px-4 h-10 text-sm font-medium cursor-pointer select-none transition-opacity',
                i > 0 ? 'border-l border-[#352970]' : '',
                activeFilter === key
                  ? 'bg-[#40337F] text-white'
                  : 'bg-[#40337F] text-white opacity-50 hover:opacity-75',
              ].join(' ')}
            >
              <input
                type="radio"
                name="invite-filter"
                value={key}
                checked={activeFilter === key}
                onChange={() => setActiveFilter(key)}
                className="sr-only"
              />
              {INVITE_FILTER_SETS[key].label}
            </label>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <AppButton
            onClick={handleQueueEmails}
            disabled={selectedIds.length === 0 || isQueueing}
            size="small"
          >
            {isQueueing ? 'Queuing…' : `Send Invites${selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}`}
          </AppButton>
      </div>
      </div>

      <div className="z-50 px-6 py-6 overflow-y-scroll bg-[#FCFCFC] border-gray-300 rounded-2xl">

        <div className="h-[430px] overflow-y-scroll z-50 rounded-l border border-[#EEEEEE]">
          <div className="py-4">
            <Table
              data={applications ?? []}
              columns={columns}
              search={true}
              pagination={true}
              loading={isLoadingApplications}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              getRowId={(row, index) => row.id ?? `missing-id-${index}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  );
}
