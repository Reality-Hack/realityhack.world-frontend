'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { TextField, Autocomplete, Checkbox, FormControlLabel } from '@mui/material';
import { useSpecialTracks } from '@/hooks/useSpecialTracks';
import { SpecialTrackSelect } from '@/components/SpecialTrackSelect';
import { TextInput, TextAreaInput } from '@/components/Inputs';
import type {
  PatchedTeamUpdateRequest,
  TeamDetail,
  TeamTable,
  Table,
  TableRequest,
  AttendeeName,
  LocationRequest,
  EventTrack,
  EventDestinyHardware
} from '@/types/models';
import { 
  useTeamsPartialUpdate,
  useTablesList,
} from '@/types/endpoints';
import type { ProjectRequest } from '@/types/models';
import { 
  convertEventTracksFromTeamData, 
  convertEventHardwareFromTeamData, 
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
  hardwareHack: boolean;
  startupHack: boolean;
  communityHack: boolean;
}

interface TeamFormProps {
  teamData: TeamDetail;
  teamId: string;
  onUpdateSuccess: () => void;
}

const isSpecialTracksEnabled = process.env.NEXT_PUBLIC_SPECIAL_TRACKS_ENABLED === 'true';

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
    selectedHardware: [],
    hardwareHack: false,
    startupHack: false,
    communityHack: false
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tableOptions, setTableOptions] = useState<Table[] | null>(null);
  const formInitializedRef = useRef(false);
  const [isFormReady, setIsFormReady] = useState(false);

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
  }, [tables, teamData?.table?.id]);

  useMemo(() => {
    return getSelectedTableFromOptions(formData.tableId, tableOptions);
  }, [formData.tableId, tableOptions]);

  // Initialize form data from teamData - only runs once when all data is ready
  useEffect(() => {
    if (formInitializedRef.current) return;
    if (!teamData || isTracksLoading || isTablesLoading || tableOptions === null) return;

    formInitializedRef.current = true;

    if (tracks.length < 1) {
      toast.error('No tracks available');
    }
    if (hardwareTracks.length < 1) {
      toast.error('No hardware tracks available');
    }
    if (tableOptions.length < 1) {
      toast.error('No tables available');
    }

    const members: TeamMember[] = teamData.attendees.map((attendee: AttendeeName) => ({
      id: attendee.id || '',
      first_name: attendee.first_name || '',
      last_name: attendee.last_name || '',
      role: attendee.participation_role || '',
      profile_image: attendee.profile_image || { file: '' }
    }));
    
    setTeamMembers(members);

    // Cast event_tracks and event_destiny_hardware since types may not be regenerated yet
    const eventTracks = (teamData as unknown as { event_tracks?: EventTrack[] }).event_tracks;
    const eventHardware = (teamData as unknown as { event_destiny_hardware?: EventDestinyHardware[] }).event_destiny_hardware;
    
    setFormData({
      name: teamData.name || '',
      devpost: teamData.project?.submission_location || '',
      github: teamData.project?.repository_location || '',
      tableId: teamData.table?.id || null,
      selectedTable: teamData.table || null,
      description: teamData.project?.description || '',
      projectName: teamData.project?.name || '',
      selectedTracks: convertEventTracksFromTeamData(eventTracks),
      selectedHardware: convertEventHardwareFromTeamData(eventHardware),
      hardwareHack: teamData.hardware_hack ?? false,
      startupHack: teamData.startup_hack ?? false,
      communityHack: (teamData as unknown as { community_hack?: boolean }).community_hack ?? false
    });
    setIsFormReady(true);
  }, [teamData, tracks, hardwareTracks, isTracksLoading, isTablesLoading, tableOptions]);

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
      location: table?.location as Location | null
    } as TeamTable;
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
    if (!formData.projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a project description');
      return;
    }
    // if (isSpecialTracksEnabled && !formData.selectedTracks.length) {
    //   toast.error('Please select at least one track');
    //   return;
    // }
    // if (isSpecialTracksEnabled && !formData.selectedHardware.length) {
    //   toast.error('Please select at least one hardware');
    //   return;
    // }
    if (!formData.github.trim()) {
      toast.error('Please enter a GitHub URL');
      return;
    }
    if (!formData.devpost.trim()) {
      toast.error('Please enter a DevPost URL');
      return;
    }
    if (!formData.github.trim().startsWith('http://') && !formData.github.trim().startsWith('https://')) {
      toast.error('GitHub URL must start with http:// or https://');
      return;
    }
    if (!formData.devpost.trim().startsWith('http://') && !formData.devpost.trim().startsWith('https://')) {
      toast.error('DevPost URL must start with http:// or https://');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Please enter a team name');
      return;
    }

    const tableRequest: TableRequestWithId = {
      id: formData.selectedTable.id,
      number: formData.selectedTable.number,
      location: formData.selectedTable.location as LocationRequest
    };

    try {
      // Build update request with event-scoped fields
      // Cast to include new fields until types are regenerated
      const updateRequest = {
        name: formData.name,
        attendees: teamMembers.map(member => member.id),
        table: tableRequest,
        event_tracks: formData.selectedTracks,
        event_destiny_hardware: formData.selectedHardware,
        hardware_hack: formData.hardwareHack,
        startup_hack: formData.startupHack,
        community_hack: formData.communityHack,
        project: {
          name: formData.projectName,
          description: formData.description,
          repository_location: formData.github,
          submission_location: formData.devpost
        } as ProjectRequest
      } as PatchedTeamUpdateRequest;

      await updateTeam(updateRequest);
      
      toast.success('Team updated successfully');
      mutateTables();
      onUpdateSuccess();
      
    } catch (error) {
      console.error('Failed to update team:', error);
      toast.error(`Error updating team: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (!isFormReady) {
    return (
      <div className="flex flex-col items-start">
        <h1 className="text-md text-[#4D97E8] font-semibold">MANAGE TEAM</h1>
        <div className="mt-4 text-gray-600">Loading team data...</div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-md text-[#4D97E8] font-semibold">MANAGE TEAM</h1>
      <div className="text-xs/8 mb-8 md:mb-4 text-gray-800">
        Please note: all fields are required for submission. You can use placeholder URLs for DevPost and GitHub if you don't have one yet.
      </div>
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
          onChange={(event: unknown, newValue: Table | null | undefined) => {
            handleTableChange(newValue);
          }}
          options={tableOptions || []}
          getOptionLabel={option => getTableLabel(option)}
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

      {isSpecialTracksEnabled && (
        <>
          <div className="flex flex-col mb-4 w-full md:w-1/2">
            <SpecialTrackSelect
              selectedTracks={formData.selectedTracks}
              onChange={(selectedTracks: string[]) => updateFormData('selectedTracks', selectedTracks)}
              options={tracks}
              maxSelections={1}
              limitSelection={false}
              labelClass="text-xs/8"
              type="track"
              disabled={true}
            />
          </div>
          <div className="flex flex-col mb-4 w-full md:w-1/2">
            <SpecialTrackSelect
              selectedTracks={formData.selectedHardware}
              onChange={(selectedHardware: string[]) => updateFormData('selectedHardware', selectedHardware)}
              options={hardwareTracks}
              maxSelections={3}
              limitSelection={false}
              labelClass="text-xs/8"
              type="hardware"
              disabled={true}
            />
          </div>

          <div className="flex flex-col mb-4 w-full md:w-1/2">
            <label className="text-xs/8 mb-2">SPECIAL CATEGORIES</label>
            <div className="flex flex-col gap-1">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.hardwareHack}
                    onChange={(e) => updateFormData('hardwareHack', e.target.checked)}
                    size="small"
                  />
                }
                label="Hardware Hack"
                slotProps={{ typography: { className: 'text-sm' } }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.startupHack}
                    onChange={(e) => updateFormData('startupHack', e.target.checked)}
                    size="small"
                  />
                }
                label="Founders Lab"
                slotProps={{ typography: { className: 'text-sm' } }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.communityHack}
                    onChange={(e) => updateFormData('communityHack', e.target.checked)}
                    size="small"
                  />
                }
                label="Community Hack"
                slotProps={{ typography: { className: 'text-sm' } }}
              />
            </div>
          </div>
        </>
      )}

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
