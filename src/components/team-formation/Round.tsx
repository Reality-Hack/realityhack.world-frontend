import React from 'react';
import MyRadioButtonGroup from './RadioOptions';

interface TeamMember {
  name: string;
  // Add other properties if there are any
}

interface RoundProps {
  round: number;
  location: string;
  track: string;
  team: TeamMember[];
}

export default function Round({ round, location, track, team }: RoundProps): JSX.Element {
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
      <div className="flex flex-col gap-4">
        <div className="text-blue-400 font-semibold text-lg">VIBE CHECK</div>
        <div>
          After meeting your team and discussing your ideas, how do you feel about your team members and your project idea?
        </div>
        {/* <div className="flex flex-row gap-4">
          <div className="bg-red-600 text-white px-4 py-2 rounded-3xl">
            I like this team and idea
          </div>
          <div className="bg-green-600 text-white px-4 py-2 rounded-3xl">
            Match me with a new team
          </div>
        </div> */}
          <MyRadioButtonGroup />
      </div>
    </div>
  );
}
