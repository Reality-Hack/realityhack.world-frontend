'use client';

import TeamForm from '@/components/admin/teams/TeamForm';
import { useTeamsRetrieve } from '@/types/endpoints';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TeamOperationResult } from '@/types/types2';

export default function TeamPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();

  const { data: team } = useTeamsRetrieve(params.id, {
    request: {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'JWT ' + session?.access_token
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
