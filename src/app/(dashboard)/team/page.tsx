'use client';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import {
  SerializedTeam,
  getTeam,
  updateTeam,
  PatchedTeam,
  TrackEnum
} from '@/app/api/team';
import { useAuthContext } from '@/hooks/AuthContext';
import { useSpecialTracks, Track } from '@/hooks/useSpecialTracks';
import { SpecialTrackSelect } from '@/components/SpecialTrackSelect';
import { TextInput, TextAreaInput } from '../../../components/Inputs';
import { toast } from 'sonner';
import { components } from '@/types/schema';
import { TextField } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { getAllTables, Table } from '@/app/api/table';

interface ProfileImage {
  file: string;
}

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  location: string;
  profile_image: ProfileImage;
}

// interface TeamMembersProps {
//   attendees: Attendee[];
// }

export default function Team() {
  const { data: session, status } = useSession();
  const [team, setTeam] = useState<SerializedTeam>();

  const { user } = useAuthContext();
  const [project, setProject] = useState<string>(''); // State for the project data
  const [teamName, setTeamName] = useState<string>(team?.name || '');
  const [devpost, setDevpost] = useState<string>('');
  const [github, setGithub] = useState<string>('');
  const [table, setTable] = useState<string | undefined | null>(team?.table?.id || '');
  const [description, setDescription] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('');
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [selectedHardware, setSelectedHardware] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const { tracks, hardwareTracks, isLoading, error } = useSpecialTracks();
  const changeTable = (table: Table | undefined | null) => {
    setTable(table?.id || '');
  };

  function getTableLabel(table: number | void) {
    // TODO: update this
    if (!table) {
      return `Table #${table}`;
    }
    if (table <= 48) {
      return `Walker: Table #${table}`;
    } else {
      return `Stata: Table #${table}`;
    }
  }
  const [tableOptions, setTableOptions] = useState<Table[]>([]);

  // Extract team members from user.team.attendee
  useEffect(() => {
    if (user?.team?.attendee) {
      setTeamMembers(user?.team?.attendees);
    }

    if (session?.access_token && user?.team?.id) {
      getAllTables(session?.access_token).then(result => {
        setTableOptions(result.filter(table => table.is_claimed === false));
      });
      getTeam(user.team.id, session.access_token).then(result => {
        setTeam(result);
        setTeamName(result.name);
        setTable(result.table?.id || '');
        // setTableNumber(String(result.table?.number));
        setTeamMembers(
          result.attendees.map((attendee: any) => ({
            id: attendee.id,
            first_name: attendee.first_name,
            last_name: attendee.last_name,
            role: attendee.participation_role,
            location: attendee.location || '',
            profile_image: attendee.profile_image
          })) as TeamMember[]
        );
        if (result.project) {
          setDevpost(result.project.submission_location);
          setGithub(result.project.repository_location);
          setDescription(result.project.description);
          setProjectName(result.project.name);
        }
        // Set the selected tracks and hardware from team data
        if (result.tracks && tracks.length > 0) {
          // Convert track values to full track objects
          const trackValues = Array.isArray(result.tracks) ? result.tracks : (result.tracks as string).split(',');
          const selectedTrackObjects = trackValues
            .map((trackValue: string) => tracks.find(t => t.value[0] === trackValue))
            .filter((track: Track | undefined): track is Track => track !== undefined)
            .map((track: Track) => track.value);
          setSelectedTracks(selectedTrackObjects);
        }
        if (result.destiny_hardware && hardwareTracks.length > 0) {
          // Convert hardware values to full hardware objects
          const hardwareValues = Array.isArray(result.destiny_hardware) ? result.destiny_hardware : (result.destiny_hardware as string).split(',');
          const selectedHardwareObjects = hardwareValues
            .map((hwValue: string) => hardwareTracks.find(h => h.value[0] === hwValue))
            .filter((hw: Track | undefined): hw is Track => hw !== undefined)
            .map((hw: Track) => hw.value);
          setSelectedHardware(selectedHardwareObjects);
        }
      });
    }
  }, [user, tracks, hardwareTracks]); // Add tracks and hardwareTracks to dependencies

  const handleSaveChanges = () => {
    if (!table) {
      toast.error('Please select a table');
      return;
    }
    console.log('Saving team with:', {
      tracks: selectedTracks,
      hardware: selectedHardware,
      teamName,
      table: table,
      project: {
        name: projectName,
        description,
        devpost,
        github
      }
    });
    
    // Create the update object with proper types
    const updatedTeam: Partial<PatchedTeam> = {
      name: teamName,
      attendees: teamMembers.map(attendee => attendee.id),
      table: tableOptions.find(t => t.id === table),
      project: team?.project ? {
        ...team.project,
        submission_location: devpost,
        name: projectName,
        repository_location: github,
        description: description,
      } : {
        submission_location: devpost,
        name: projectName,
        repository_location: github,
        description: description,
        id: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        team: team?.id
      }
    };

    // Create the request body with tracks as comma-separated strings
    const requestBody = {
      ...updatedTeam,
      tracks: selectedTracks,
      destiny_hardware: selectedHardware
    };

    // Log the exact data being sent
    console.log('Sending request body:', JSON.stringify(requestBody, null, 2));

    if (session) {
      // Update using JSON
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/${user.team.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'JWT ' + session.access_token
        },
        body: JSON.stringify(requestBody)
      })
        .then(async response => {
          const data = await response.json();
          if (!response.ok) {
            throw new Error(JSON.stringify(data));
          }
          return data;
        })
        .then(result => {
          toast.success('Team updated successfully');
          // Refresh the team data to show updated selections
          getTeam(user.team.id, session.access_token).then(result => {
            setTeam(result);
            if (result.tracks && tracks.length > 0) {
              // Convert track values to full track objects
              const trackValues = Array.isArray(result.tracks) ? result.tracks : (result.tracks as string).split(',');
              const selectedTrackObjects = trackValues
                .map((trackValue: string) => tracks.find(t => t.value[0] === trackValue))
                .filter((track: Track | undefined): track is Track => track !== undefined)
                .map((track: Track) => track.value);
              setSelectedTracks(selectedTrackObjects);
            }
            if (result.destiny_hardware && hardwareTracks.length > 0) {
              // Convert hardware values to full hardware objects
              const hardwareValues = Array.isArray(result.destiny_hardware) ? result.destiny_hardware : (result.destiny_hardware as string).split(',');
              const selectedHardwareObjects = hardwareValues
                .map((hwValue: string) => hardwareTracks.find(h => h.value[0] === hwValue))
                .filter((hw: Track | undefined): hw is Track => hw !== undefined)
                .map((hw: Track) => hw.value);
              setSelectedHardware(selectedHardwareObjects);
            }
          });
        })
        .catch(error => toast.error(`Error updating team: ${error}`));
    } else toast.error('No user session, please login and try again');
  };

  return (
    <div className="h-screen p-6 flex flex-col items-start">
      <div className="pb-8 flex flex-col items-start w-full ">
        <h1 className="text-3xl pb-9 mb-10 font-semibold">Teams</h1>
        <hr className="w-full mt-2 border-t-2 border-gray-300 mt-4" />
      </div>
      {user?.team ? (
        <>
          <h1 className="text-md text-[#4D97E8] mb-7 font-semibold">MANAGE TEAM</h1>

          <div className="flex flex-col mb-4 w-full md:w-1/2">
            <label className="text-xs/8">TEAM NAME</label>
            <TextInput
              name="team-name"
              type="text"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              placeholder="Team Name"
            />
          </div>

          <div className="flex flex-col mb-4 w-full md:w-1/2">
            <label className="text-xs/8">DEVPOST</label>
            <TextInput
              name="devpost"
              type="text"
              value={devpost}
              onChange={e => setDevpost(e.target.value)}
              placeholder="DevPost URL"
            />
          </div>

          <div className="flex flex-col mb-4 w-full md:w-1/2">
            <label className="text-xs/8">GITHUB</label>
            <TextInput
              name="github"
              type="text"
              value={github}
              onChange={e => setGithub(e.target.value)}
              placeholder="GitHub URL"
            />
          </div>

          <div className="flex flex-col mb-4 w-full md:w-1/2 gap-3">
            <Autocomplete
              id="table-select"
              value={team?.table || null}
              loading={isLoading}
              onChange={(event: any, newValue: Table | null | undefined) => {
                changeTable(newValue);
              }}
              options={tableOptions}
              getOptionLabel={option => getTableLabel(option?.number)}
              getOptionKey={option => option?.id ?? ''}
              isOptionEqualToValue={(a, b) => a?.id === b?.id}
              renderInput={params => (
                <TextField {...params} label="Table" size="small" className="w-1/2" />
              )}
            /> 
          </div>

          <div className="flex flex-col mb-4 w-full md:w-1/2">
            <label className="text-xs/8">PROJECT NAME</label>
            <TextInput
              name="project-name"
              type="text"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              placeholder="Project Name"
            />
            <TextAreaInput
              value={description}
              name="team description"
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your project"
            >
              <label className="text-xs/8">PROJECT DESCRIPTION</label>
            </TextAreaInput>
          </div>

          <div className="flex flex-col mb-4 w-full md:w-1/2">
            <SpecialTrackSelect
              selectedTracks={selectedTracks}
              onChange={setSelectedTracks}
              maxSelections={2}
              labelClass="text-xs/8"
              type="track"
            />
          </div>

          <div className="flex flex-col mb-4 w-full md:w-1/2">
            <SpecialTrackSelect
              selectedTracks={selectedHardware}
              onChange={setSelectedHardware}
              maxSelections={1}
              labelClass="text-xs/8"
              type="hardware"
            />
          </div>

          <div className="flex flex-col mb-4 w-full md:w-1/2">
            <label className="text-xs/8">TEAM MEMBERS</label>
            <div className="grid grid-cols-2 gap-4">
              {teamMembers &&
                teamMembers.map((attendee: TeamMember) => (
                  <div key={attendee.id} className="flex items-center space-x-4">
                    {attendee.profile_image?.file && (
                      <img
                        src={attendee.profile_image?.file}
                        alt={`${attendee.first_name} ${attendee.last_name}`}
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    <div className="flex flex-row justify-between w-full">
                      <h3 className="text-sm font-semibold">
                        {attendee.first_name} {attendee.last_name}
                      </h3>
                    </div>
                    <a className="text-xs text-blue-500 underline justify-right text-right">
                      View
                    </a>
                    {/* <div className="text-xs text-gray-500 justify-right text-right">
                      &nbsp;x
                    </div> */}
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-row justify-between w-full md:w-1/2 pb-8">
            <button
              className="bg-blue-400 text-white rounded-2xl p-2 text-xs pl-4 pr-4"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
          </div>
        </>
      ) : (
        <h1 className="text-xl">Please register your team first</h1>
      )}
    </div>
  );
}