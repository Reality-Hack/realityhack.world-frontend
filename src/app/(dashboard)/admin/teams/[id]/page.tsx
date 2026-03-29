import { useTeamsRetrieve } from '@/types/endpoints';
import { useSession } from '@/auth/client';
import { TeamForm } from '@/components/TeamForm/TeamForm';
import { useAppParams } from '@/routing';
import { useMemo } from 'react';
import { Loader } from '@/components/Loader';

export default function TeamPage() {
  const { id = '' } = useAppParams();
  const { data: session } = useSession();

  const { data: team, mutate: mutateTeam } = useTeamsRetrieve(id, {
    swr: { enabled: !!session?.access_token }
  });

  const handleUpdateSuccess = async (): Promise<void> => {
    await mutateTeam();
  };

  const header = useMemo(() => {
    return (
      <div className="flex justify-between items-center">
        <h1 className="text-3xl">{team?.name} (Team #{team?.number})</h1>
      </div>
    );
  }, [team]);

  if (!team) {
    return <Loader  loadingText="Loading team data..." />;
  }

  return (
    <div className="p-6 pt-8 pl-2">
      {header}
      <div className="py-4">
        {team && (
          <TeamForm
            teamData={team}
            teamId={id}
            onSuccess={handleUpdateSuccess}
            isAdminView={true}
          />
        )}
      </div>
    </div>
  );
}
