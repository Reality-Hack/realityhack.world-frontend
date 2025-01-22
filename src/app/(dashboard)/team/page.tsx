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
  const [buildingFloor, setBuildingFloor] = useState<string>('');
  const [tableNumber, setTableNumber] = useState<string>(
    String(team?.table?.number) || ''
  );
  const [description, setDescription] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('');
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const { tracks, isLoading, error } = useSpecialTracks();
  // Extract team members from user.team.attendee
  useEffect(() => {
    if (user?.team?.attendee) {
      setTeamMembers(user?.team?.attendees);
    }

    if (session?.access_token && user?.team?.id) {
      getTeam(user.team.id, session.access_token).then(result => {
        console.log(result);
        setTeam(result);
        setTeamName(result.name);
        setTableNumber(String(result.table?.number));
        console.log(result.attendees);
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
      });
    }
  }, [user]);

  const handleSaveChanges = () => {
    const updatedTeam: PatchedTeam = {
      name: teamName,
      attendees: teamMembers.map(attendee => attendee.id),
      // tracks: selectedTracks.map(track => TrackEnum[track]),
      project: {
        submission_location: devpost,
        name: projectName,
        repository_location: github,
        description: description,
        id: team?.project?.id || '',
      }
    };
    if (session) {
      updateTeam(user.team.id, updatedTeam, session?.access_token).catch(
        error => toast.error(`Error updating team: ${error}`)
      );
    } else toast.error('No user session, please login and try again');
  };

  return (
    <div className="h-screen p-6 flex flex-col items-start">
      <div className="pb-8 flex flex-col items-start w-full ">
        <h1 className="text-3xl pb-9 mb-10 font-semibold">Teams</h1>
        <hr className="w-full mt-2 border-t-2 border-gray-300 mt-4" />
      </div>
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

      <div className="flex flex-row mb-4 w-full md:w-1/2 gap-3">
        <div className="flex flex-col w-full md:w-1/2">
          <label className="text-xs/8">BUILDING/FLOOR</label>
          {/* this should be a multiselect */}
          <TextInput
            name="building-floor"
            type="text"
            value={buildingFloor}
            onChange={e => setBuildingFloor(e.target.value)}
            placeholder="Table Location"
          />
        </div>

        <div className="flex flex-col w-full md:w-1/2">
          <label className="text-xs/8">TABLE NUMBER</label>
          <TextInput
            name="table-location"
            type="text"
            value={tableNumber}
            onChange={e => setTableNumber(e.target.value)}
            placeholder="Table Location"
          />
        </div>
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
    </div>
  );
}
