import { useTeamsList, TeamsListQueryResult } from '@/types/endpoints';
import Table from '@/components/Table';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { DateTime } from 'luxon';
import { useSession } from '@/auth/client';
import { useAppNavigate } from '@/routing';
import { useEffect, useMemo, useState } from 'react';
import type { TeamProject } from '@/types/models';
import LinearProgressWithLabel from '@/components/common/AppLinearProgress';

type MappedTeam = Omit<TeamsListQueryResult[number], 'number'> & {
  number: number | string;
  preparedness_level: number;
};

export default function TeamTable() {
  const router = useAppNavigate();
  const { data: session } = useSession();
  const isAdmin = session && session.roles?.includes('admin');
  const [mappedTeams, setMappedTeams] = useState<MappedTeam[]>([]);
  const [isMappingTeams, setIsMappingTeams] = useState(true);

  const {
    data: teams = [],
    error,
    isLoading: loading
  } = useTeamsList({}, {
    swr: {
      enabled: !!(session?.access_token && isAdmin)
    }
  });

  const teamCensusPreparednessLevel: Record<string, number> = useMemo(() => {
    return teams.reduce((acc, team) => {
      // 'census_location_override', 'census_taker_name', 'team_primary_contact'
      let projectCompletion = 0;
      if (team.project) {
        const projectFields = ['name', 'description', 'repository_location', 'submission_location'];
        projectCompletion = projectFields.filter(
          field => team.project[field as keyof TeamProject] !== null && team.project[field as keyof TeamProject] !== undefined && team.project[field as keyof TeamProject] !== ''
        ).length;
      }
      const tableClaim = team.table ? 1 : 0;
      return { ...acc, [team.id as string]: Math.round((projectCompletion + tableClaim) / 5 * 100) };
    }, {});
  }, [teams]);

  useEffect(() => {
    if (teams.length === 0) {
      setIsMappingTeams(false);
      return;
    }
    setIsMappingTeams(true);
    const mapped = teams.map(team => ({
      ...team,
      preparedness_level: teamCensusPreparednessLevel[team.id as string],
      number: team.number ?? '—'
    }));
    setMappedTeams(mapped);
    setIsMappingTeams(false);
  }, [teams, teamCensusPreparednessLevel]);

  const columnHelper = createColumnHelper<MappedTeam>();
  const columns = useMemo<ColumnDef<MappedTeam, any>[]>(
    () => [
      columnHelper.accessor('number', {
        header: () => 'Team #',
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
      columnHelper.accessor('startup_hack', {
        header: () => 'Founders Lab',
        cell: info => info.getValue() ? 'Yes' : 'No'
      }),
      columnHelper.accessor('community_hack', {
        header: () => 'Community Hack',
        cell: info => info.getValue() ? 'Yes' : 'No'
      }),
      columnHelper.accessor('hardware_hack', {
        header: () => 'Hardware Hack',
        cell: info => info.getValue() ? 'Yes' : 'No'
      }),
      columnHelper.accessor('preparedness_level', {
        header: () => 'CensusPreparedness',
        cell: info => <LinearProgressWithLabel progress={info.getValue()} />
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
        <div className="max-h-[calc(100vh-200px)] overflow-y-scroll z-50 rounded-l border border-[#EEEEEE]">
          <Table
            data={mappedTeams}
            columns={columns}
            search={true}
            loading={loading || isMappingTeams}
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
