import TeamForm from '@/components/admin/teams/TeamForm';
import { useTeamsRetrieve } from '@/types/endpoints';
import { useSession } from '@/auth/client';
import { useAppParams } from '@/routing';

export default function TeamPage() {
  const { id = '' } = useAppParams();
  const { data: session } = useSession();

  const { data: team } = useTeamsRetrieve(id, {
    request: {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + session?.access_token
      }
    }
  });

  const handleError = (error: any) => {
    console.error('Team operation failed:', error);
  };

  return (
    <div className="p-6 pt-8 pl-2">
      <h1 className="text-3xl">Team: {team?.name}</h1>
      <div className="py-4">
        {team && (
          <TeamForm
            initialData={team}
            onError={handleError}
          />
        )}
      </div>
    </div>
  );
}
