'use client';
import { getAllTeams, Team } from '@/app/api/team';
import Table from '@/components/Table';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { DateTime } from 'luxon';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function TeamTable() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const isAdmin = session && session.roles?.includes('admin');

  useEffect(() => {
    if (session?.access_token && isAdmin) {
      setLoading(true);
      getAllTeams(session.access_token)
        .then(teams => {
          setTeams(teams);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const columnHelper = createColumnHelper<Team>();
  const columns = useMemo<ColumnDef<Team, any>[]>(
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
