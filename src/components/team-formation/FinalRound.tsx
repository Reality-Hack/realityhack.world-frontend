
interface TeamMember {
  name: string;
  // Add other properties if there are any
}

interface FinalRoundProps {
  round: number;
  location: string;
  track: string;
  team: TeamMember[];
}

export default function FinalRound({ round, location, track, team }: FinalRoundProps): JSX.Element {
  return (
    <div>
      <div className="flex flex-col gap-4 border-b-2 mb-8 pb-4">
        <div className="text-blue-400 font-semibold text-lg">TEAM MEMBERS - ROUND {round}</div>
        <div>
          Join your team members at <span className='text-lg font-semibold'>{location}</span> to start discussing ideas. All your team members are interested in the track: <span className='text-lg font-semibold'>{track}</span>
        </div>

        <div className="flex flex-wrap gap-2 ">
          {team.map((member: TeamMember) => (
            <div key={member.name}>{member.name}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
