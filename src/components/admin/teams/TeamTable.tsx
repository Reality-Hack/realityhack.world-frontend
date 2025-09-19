'use client';
import { useTeamsList, TeamsListQueryResult } from '@/types/endpoints';
import Table from '@/components/Table';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { DateTime } from 'luxon';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

export default function TeamTable() {
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session && session.roles?.includes('admin');

  const {
    data: teams = [],
    error,
    isLoading: loading
  } = useTeamsList(undefined, {
    swr: {
      enabled: !!(session?.access_token && isAdmin)
    },
    request: {
      headers: {
        Authorization: `JWT ${session?.access_token}`
      }
    }
  });

  const columnHelper = createColumnHelper<TeamsListQueryResult[0]>();
  const columns = useMemo<ColumnDef<TeamsListQueryResult[0], any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: () => 'ID',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('name', {
        header: () => 'Name',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('attendees', {
        header: () => '# of Members',
        cell: info => info.getValue().length
      }),
      columnHelper.accessor('created_at', {
        header: () => 'Created On',
        cell: info =>
          DateTime.fromISO(info.getValue()).toLocaleString(
            DateTime.DATETIME_SHORT
          )
      }),
      columnHelper.accessor('updated_at', {
        header: () => 'Updated On',
        cell: info =>
          DateTime.fromISO(info.getValue()).toLocaleString(
            DateTime.DATETIME_SHORT
          )
      })
    ],
    [columnHelper]
  );

  return (
    <>
      <div className="z-50 p-4 overflow-y-scroll bg-[#FCFCFC] border-gray-300 rounded-2xl">
        <div className="h-[430px] overflow-y-scroll z-50 rounded-l border border-[#EEEEEE]">
          <Table
            data={teams}
            columns={columns}
            search={true}
            loading={loading}
            pagination={true}
            onRowClick={row => {
              router.push(`/admin/teams/${row.original.id}`);
            }}
          />
        </div>
      </div>
    </>
  );
}
