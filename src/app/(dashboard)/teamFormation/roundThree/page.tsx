"use client"
import Round from "@/components/teamFormation/Round";

export default function RoundTwo() {
    const team = [{name:"Santiago Dimaren"},
    {name:"Shane Sengelman"},
    {name:"Austin Edelman"},
    {name:"Stepan Something"},
    {name:"Peter Something"}]
  return (
    <div>
      <Round round={2} location="Table 1" track="track 8" team={team}/>
    </div>
  );
}
