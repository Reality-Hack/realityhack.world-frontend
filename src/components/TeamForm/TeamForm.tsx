'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { TextField, Autocomplete } from '@mui/material';
import { useSpecialTracks, Track } from '@/hooks/useSpecialTracks';
import { SpecialTrackSelect } from '@/components/SpecialTrackSelect';
import { TextInput, TextAreaInput } from '@/components/Inputs';
import type {
  PatchedTeamUpdateRequest,
  TeamDetail,
  TeamTable,
  PatchedTeamUpdateRequestTable,
  Table,
  TableRequest,
  AttendeeName
} from '@/types/models';
import { 
  useTeamsPartialUpdate,
  useTablesList,
  useTablesUpdate,
} from '@/types/endpoints';
import type { 
  ProjectRequest,
  TrackEnum,
  DestinyHardwareEnum
} from '@/types/models';
import { 
  convertTracksFromTeamData, 
  convertHardwareFromTeamData, 
  getSelectedTableFromOptions, 
  getTableLabel 
} from './utils';

interface ProfileImage {
  file: string;
}

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  profile_image: ProfileImage;
}

type TableRequestWithId = TableRequest & { id?: string };

interface TeamFormData {
  name: string;
  devpost: string;
  github: string;
  tableId: string | null;
  selectedTable: TeamTable | null;
  description: string;
  projectName: string;
  selectedTracks: string[];
  selectedHardware: string[];
}

interface TeamFormProps {
  teamData: TeamDetail;
  teamId: string;
  onUpdateSuccess: () => void;
}

export function TeamForm({ teamData, teamId, onUpdateSuccess }: TeamFormProps) {
  const { data: session } = useSession();
  
  const { 
    trigger: updateTeam, 
    isMutating: isUpdating 
  } = useTeamsPartialUpdate(teamId);

  const [formData, setFormData] = useState<TeamFormData>({
    name: '',
    devpost: '',
    github: '',
    tableId: null,
    selectedTable: null,
    description: '',
    projectName: '',
    selectedTracks: [],
    selectedHardware: []
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tableOptions, setTableOptions] = useState<Table[] | null>(null);

  const { tracks, hardwareTracks, isLoading: isTracksLoading } = useSpecialTracks();
  const { data: tables, isLoading: isTablesLoading, mutate: mutateTables } = useTablesList({}, {
    swr: { enabled: !!session?.access_token}, 
    request: {
      headers: {
        'Authorization': `JWT ${session?.access_token}`
      }
    }
  });

  useEffect(() => {
    if (tables) {
      const filteredTables = tables
        .filter(table => !table.is_claimed || table.id === teamData?.table?.id);
      setTableOptions(filteredTables);
    }
  }, [tables]);

  useMemo(() => {
    return getSelectedTableFromOptions(formData.tableId, tableOptions);
  }, [formData.tableId, tableOptions]);

  useEffect(() => {
    if (teamData && !isTracksLoading && !isTablesLoading && tableOptions !== null) {
      if (tracks.length < 1) {
        toast.error('No tracks available');
        return;
      }
      if (hardwareTracks.length < 1) {
        toast.error('No hardware tracks available');
      }
      if (tableOptions && tableOptions.length < 1) {
        toast.error('No tables available');
        return;
      }

      const members: TeamMember[] = teamData.attendees.map((attendee: AttendeeName) => {
        const member: TeamMember = {
          id: attendee.id || '',
          first_name: attendee.first_name || '',
          last_name: attendee.last_name || '',
          role: attendee.participation_role || '',
          profile_image: attendee.profile_image || { file: '' }
        };
      return member;
    });
      
      setTeamMembers(members);
      
      setFormData({
        name: teamData.name || '',
        devpost: teamData.project?.submission_location || '',
        github: teamData.project?.repository_location || '',
        tableId: teamData.table?.id || null,
        selectedTable: teamData.table || null,
        description: teamData.project?.description || '',
        projectName: teamData.project?.name || '',
        selectedTracks: convertTracksFromTeamData(teamData.tracks, tracks),
        selectedHardware: convertHardwareFromTeamData(teamData.destiny_hardware, hardwareTracks)
      });
    }
  }, [teamData, tracks, hardwareTracks, convertTracksFromTeamData, convertHardwareFromTeamData, isTracksLoading, isTablesLoading, tableOptions]);

  const updateFormData = useCallback(<K extends keyof TeamFormData>(
    field: K, 
    value: TeamFormData[K]
  ): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleTableChange = useCallback((table: Table | null | undefined): void => {
    updateFormData('tableId', table?.id || null);
    const mappedTable: TeamTable = {
      id: table?.id || '',
      number: table?.number || 0,
      location: { id: table?.location || undefined }
    };
    updateFormData('selectedTable', mappedTable || null);
  }, [updateFormData]);

  const handleSaveChanges = async (): Promise<void> => {
    if (!formData.selectedTable) {
      toast.error('Please select a table');
      return;
    }

    if (!teamId) {
      toast.error('No team ID found');
      return;
    }
    const tableRequest: TableRequestWithId = {
      id: formData.selectedTable.id,
      number: formData.selectedTable.number,
    };

    try {
      const updateRequest: PatchedTeamUpdateRequest = {
        name: formData.name,
        attendees: teamMembers.map(member => member.id),
        table: tableRequest,
        tracks: formData.selectedTracks as TrackEnum[],
        destiny_hardware: formData.selectedHardware as DestinyHardwareEnum[],
        project: {
          name: formData.projectName,
          description: formData.description,
          repository_location: formData.github,
          submission_location: formData.devpost
        } as ProjectRequest
      };
      await updateTeam(updateRequest);
      
      toast.success('Team updated successfully');
      mutateTables();
      onUpdateSuccess();
      
    } catch (error) {
      console.error('Failed to update team:', error);
      toast.error(`Error updating team: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <>
      <h1 className="text-md text-[#4D97E8] mb-7 font-semibold">MANAGE TEAM</h1>

      <div className="flex flex-col mb-4 w-full md:w-1/2">
        <label className="text-xs/8">TEAM NAME</label>
        <TextInput
          name="team-name"
          type="text"
          value={formData.name}
          onChange={e => updateFormData('name', e.target.value)}
          placeholder="Team Name"
        />
      </div>

      <div className="flex flex-col mb-4 w-full md:w-1/2">
        <label className="text-xs/8">DEVPOST</label>
        <TextInput
          name="devpost"
          type="text"
          value={formData.devpost}
          onChange={e => updateFormData('devpost', e.target.value)}
          placeholder="DevPost URL"
        />
      </div>

      <div className="flex flex-col mb-4 w-full md:w-1/2">
        <label className="text-xs/8">GITHUB</label>
        <TextInput
          name="github"
          type="text"
          value={formData.github}
          onChange={e => updateFormData('github', e.target.value)}
          placeholder="GitHub URL"
        />
      </div>

      <div className="flex flex-col mb-4 w-full md:w-1/2 gap-3">
        <Autocomplete
          id="table-select"
          value={getSelectedTableFromOptions(formData.tableId, tableOptions || [])}
          loading={isTracksLoading}
          onChange={(event: any, newValue: Table | null | undefined) => {
            handleTableChange(newValue);
          }}
          options={tableOptions || []}
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
          value={formData.projectName}
          onChange={e => updateFormData('projectName', e.target.value)}
          placeholder="Project Name"
        />
        <TextAreaInput
          value={formData.description}
          name="team description"
          onChange={e => updateFormData('description', e.target.value)}
          placeholder="Describe your project"
        >
          <label className="text-xs/8">PROJECT DESCRIPTION</label>
        </TextAreaInput>
      </div>

      <div className="flex flex-col mb-4 w-full md:w-1/2">
        <SpecialTrackSelect
          selectedTracks={formData.selectedTracks}
          onChange={(tracks: string[]) => updateFormData('selectedTracks', tracks)}
          maxSelections={2}
          labelClass="text-xs/8"
          type="track"
        />
      </div>

      <div className="flex flex-col mb-4 w-full md:w-1/2">
        <SpecialTrackSelect
          selectedTracks={formData.selectedHardware}
          onChange={(hardware: string[]) => updateFormData('selectedHardware', hardware)}
          maxSelections={1}
          labelClass="text-xs/8"
          type="hardware"
        />
      </div>

      <div className="flex flex-col mb-4 w-full md:w-1/2">
        <label className="text-xs/8">TEAM MEMBERS</label>
        <div className="grid grid-cols-2 gap-4">
          {teamMembers.map((attendee: TeamMember) => (
            <div key={attendee.id} className="flex items-center space-x-4">
              {attendee.profile_image?.file && (
                <img
                  src={attendee.profile_image.file}
                  alt={`${attendee.first_name} ${attendee.last_name}`}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div className="flex flex-row justify-between w-full">
                <h3 className="text-sm font-semibold">
                  {attendee.first_name} {attendee.last_name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-row justify-between w-full md:w-1/2 pb-8">
        <button
          className="bg-blue-400 text-white rounded-2xl p-2 text-xs pl-4 pr-4 disabled:opacity-50"
          onClick={handleSaveChanges}
          disabled={isUpdating}
        >
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </>
  );
}
