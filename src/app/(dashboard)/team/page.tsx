'use client';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { SerializedTeam, getTeam } from '@/app/api/team';
import { useAuthContext } from '@/hooks/AuthContext';

export default function Team() {
  const { data: session, status } = useSession();
  const [team, setTeam] = useState<SerializedTeam>();

  const { user } = useAuthContext();
  console.log(user);

  useEffect(() => {
    if (session?.access_token && user?.team?.id) {
      getTeam(user.team.id, session.access_token).then(result => {
        setTeam(result);
      });
    }
  }, [user]);

  console.log(team?.table);

  return (
    <div className="h-screen p-6 flex flex-row justify-center items-start">
      <div className="grid grid-cols-2 gap-4 mx-8 mt-12">
          <h2 className="text-lg font-bold">Team Name: </h2>
          <div className="text-lg">{team?.name}</div>
          <h3 className="text-lg font-bold">Team Members:</h3>
          <ul>
            {team?.attendees.map((attendee) => (
          <li key={attendee.id}>{attendee.first_name} {attendee.last_name}</li>
            ))}
          </ul>
          <p className="text-lg font-bold">Table Number: </p>
          <div className="text-lg">{team?.table?.number}</div>
      </div>
    </div>
  );
}
