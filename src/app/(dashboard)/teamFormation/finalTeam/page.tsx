"use client"
import { useSession } from 'next-auth/react';

import FinalRound from "@/components/teamFormation/FinalRound";

export default function RoundTwo() {
  const { data: session, status } = useSession();
    const team = [{name:"Santiago Dimaren"},
    {name:"Shane Sengelman"},
    {name:"Austin Edelman"},
    {name:"Stepan Something"},
    {name:"Peter Something"}]
  return (
    <div>
      <FinalRound round={-1} location="Table 1" track="track 8" team={team}/>
    </div>
  );
}
