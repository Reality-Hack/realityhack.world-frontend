'use client';
import { useAuth } from '@/contexts/AuthContext';
import { TeamForm } from '@/components/TeamForm/TeamForm';
import { 
  useTeamsRetrieve
} from '@/types/endpoints';

export default function Team() {
  const { user } = useAuth();
  
  // SWR hook for data fetching
  const { 
    data: teamData, 
    error: teamError, 
    isLoading: isTeamLoading,
    mutate: mutateTeam
  } = useTeamsRetrieve(
    user?.team?.id || '', 
    { 
      swr: { 
        enabled: !!(user?.team?.id),
        revalidateOnFocus: false 
      }
    }
  );

  // Handle team data revalidation after successful updates
  const handleUpdateSuccess = async (): Promise<void> => {
    await mutateTeam();
  };

  // Handle loading state
  if (isTeamLoading) {
    return (
      <div className="h-screen p-6 flex flex-col items-start">
        <div className="pb-8 flex flex-col items-start w-full">
          <h1 className="text-3xl pb-9 mb-10 font-semibold">Teams</h1>
          <hr className="w-full mt-2 border-t-2 border-gray-300 mt-4" />
        </div>
        <div>Loading team data...</div>
      </div>
    );
  }

  // Handle error state
  if (teamError) {
    return (
      <div className="h-screen p-6 flex flex-col items-start">
        <div className="pb-8 flex flex-col items-start w-full">
          <h1 className="text-3xl pb-9 mb-10 font-semibold">Teams</h1>
          <hr className="w-full mt-2 border-t-2 border-gray-300 mt-4" />
        </div>
        <div className="text-red-500">
          Error loading team data: {teamError.message}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen p-6 flex flex-col items-start">
      <div className="pb-8 flex flex-col items-start w-full">
        <h1 className="text-3xl pb-9 mb-10 font-semibold">Teams</h1>
        <hr className="w-full mt-2 border-t-2 border-gray-300 mt-4" />
      </div>
      
      {user?.team && teamData ? (
        <TeamForm 
          teamData={teamData}
          teamId={user.team.id}
          onUpdateSuccess={handleUpdateSuccess}
        />
      ) : (
        <h1 className="text-xl">Please register your team first</h1>
      )}
    </div>
  );
}