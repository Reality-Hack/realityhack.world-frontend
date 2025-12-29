import {
  DestinyTeam,
  createAttendeeVibeForTeam,
  getAttendeeVibeForTeam,
  getAvailableTracks,
  getDestinyTeamsByAttendee,
  updateAttendeeVibeForTeam
} from '@/app/api/teamformation';
import { useAuth } from '@/contexts/AuthContext';
import LinearProgress from '@mui/material/LinearProgress';
import { Radio, RadioChangeEvent } from 'antd';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface RoundProps {
  round: number;
}

interface TrackOption {
  label: string;
  value: string;
}

/**
 * MEDIA LAB
 * future constructors - Silverman - 1-19
 * learning - 20-38
 * productivity - media lab -39-57
 * WALKER
 * living harmony - 97-104 (plus some in media lab) 58-68
 * vitality - 78 - 96
 * community - corner near the front of the building - 73-77
 * @param table number
 * @returns location
 */
function getLocation(table: number) {
  if (table >= 1 && table <= 30) {
    return 'Silverman Room Media Lab';
  }
  if (table >= 31 && table <= 68) {
    return 'Media Lab';
  }
  if (table >= 69 && table <= 104) {
    return 'Walker Memorial';
  }
}

const vibeoptions = [
  { label: ' 1', value: 1 },
  { label: ' 2', value: 2 },
  { label: ' 3', value: 3 },
  { label: ' 4', value: 4 },
  { label: ' 5', value: 5 }
];

export default function Round({ round }: RoundProps) {
  const { data: session } = useSession();
  const { user } = useAuth();
  const [destinyTeam, setDestinyTeam] = useState<DestinyTeam | void>();
  const [loading, setLoading] = useState<boolean>(false);
  const [tracks, setTracks] = useState<TrackOption[] | undefined>(undefined);
  const [error, setError] = useState<string | void>();

  const [vibe, setVibe] = useState<number>();
  const [attendeeVibeForTeamID, setAttendeeVibeForTeamID] = useState<
    string | void
  >();

  const onChange = (e: RadioChangeEvent) => {
    const newVibe = e.target.value;
    setVibe(newVibe);
    if (!!attendeeVibeForTeamID && newVibe) {
      // vibe object already exists, patch it
      updateAttendeeVibeForTeam(
        session!.access_token,
        attendeeVibeForTeamID,
        newVibe
      );
    } else if (newVibe) {
      // create new vibe object
      createAttendeeVibeForTeam(
        session!.access_token,
        destinyTeam!.id,
        user!.id,
        newVibe
      ).then(result => {
        console.log(result);
        setAttendeeVibeForTeamID(result.id);
      });
    }
  };

  useEffect(() => {
    if (session && user) {
      setLoading(true);
      getDestinyTeamsByAttendee(session?.access_token, user.id, round)
        .then(destinyTeams => {
          setDestinyTeam(destinyTeams[0]);
          if (destinyTeams.length === 1) {
            setDestinyTeam(destinyTeams[0]);
            setError(undefined);
            getAttendeeVibeForTeam(
              session?.access_token,
              destinyTeams[0].id,
              user.id
            ).then(attendeesVibeForTeam => {
              if (attendeesVibeForTeam.length > 1) {
                setError('You have multiple vibes for the same team. Uh oh!');
              } else if (attendeesVibeForTeam.length === 1) {
                setVibe(attendeesVibeForTeam[0].vibe);
                setAttendeeVibeForTeamID(attendeesVibeForTeam[0].id);
              }
            });
          } else if (destinyTeams.length > 1) {
            setError(
              'You are assigned to multiple teams this round. Please reach out to an organizer about this problem.'
            );
          } else {
            setError(
              'You are not in a team for this round. Please reach out to an organizer about this problem.'
            );
          }
        })
        .finally(() => {
          setLoading(false);
        });
      getAvailableTracks(session?.access_token)
        .then(result => {
          if (result) {
            const formattedTracks = result.track.choices.map(track => {
              return {
                label: track.display_name,
                value: track.value
              };
            });
            setTracks(formattedTracks);
          }
        })
        .catch(error => console.error(error.message));
    }
  }, [session]);

  const track = tracks?.find(t => t.value === destinyTeam?.track);

  return (
    <div>
      <div className="gap-4 border-b-2 mb-8 pb-4">
        <div className="text-blue-400 font-semibold text-lg">
          TEAM MEMBERS - ROUND {round}
        </div>
        {loading && <LinearProgress />}
        {!!error && <div>{error}</div>}
        {!loading && !!destinyTeam && (
          <>
            <div className="flex flex-col">
              <div>
                Join your team members at the following location to start
                discussing ideas.
              </div>
              <div className="text-lg font-semibold">{`Table: ${destinyTeam.table.number}`}</div>
              <div className="text-lg font-semibold">{`Building: ${getLocation(destinyTeam.table.number)}`}</div>
              <div>All your team members are interested in the track:</div>
              <div className="text-lg font-semibold">{track?.label}</div>
              {destinyTeam.hardware_hack && (
                <div>
                  You are in the{' '}
                  <span className="text-lg font-semibold">Hardware Hack</span>!
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <div className="text-blue-400 font-semibold text-lg">
                Teammates
              </div>
              <div className="flex flex-wrap gap-4">
                {destinyTeam?.attendees.map(member => (
                  <div
                    key={member.id}
                  >{`${member.first_name} ${member.last_name}`}</div>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-blue-400 font-semibold text-lg">
                VIBE CHECK
              </div>
              <div>
                After meeting your team and discussing your ideas, how do you
                feel about your team members and your project idea?
              </div>
              <Radio.Group onChange={onChange} value={vibe}>
                {vibeoptions.map(option => (
                  <Radio key={option.value} value={option.value}>
                    {option.label}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
