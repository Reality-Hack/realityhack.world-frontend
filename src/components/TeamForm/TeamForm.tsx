'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from '@/auth/client';
import { toast } from 'sonner';
import {
  TextField, Autocomplete, Checkbox, FormControlLabel, 
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material';
import { useSpecialTracks } from '@/hooks/useSpecialTracks';
import { SpecialTrackSelect } from '@/components/SpecialTrackSelect';
import { TextInput, TextAreaInput } from '@/components/Inputs';
import { TeamRsvpAttendeeMultiSelect } from '@/components/TeamRsvpAttendeeMultiSelect/TeamRsvpAttendeeMultiSelect';
import { useAppNavigate } from '@/routing';
import type {
  PatchedTeamUpdateRequest,
  TeamDetail,
  TeamTable,
  Table,
  TableRequest,
  AttendeeName,
  LocationRequest,
  EventTrack,
  EventDestinyHardware,
  EventRsvpAttendeeOption,
  TeamCreateRequest,
} from '@/types/models';
import {
  useTeamsPartialUpdate,
  useTeamsCreate,
  useTeamsDestroy,
  useTablesList,
  useTeamsList,
} from '@/types/endpoints';
import type { ProjectRequest } from '@/types/models';
import type { TeamOperationResult } from '@/types/types2';
import {
  convertEventTracksFromTeamData,
  convertEventHardwareFromTeamData,
  getSelectedTableFromOptions,
  getTableLabel,
} from './utils';
import Loader from '@/components/Loader';

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
  attendees: EventRsvpAttendeeOption[];
}

export interface TeamFormProps {
  teamData?: TeamDetail;
  teamId?: string;
  isAdminView?: boolean;
  onSuccess?: (team: TeamOperationResult | null) => void;
  onError?: (error: unknown) => void;
  onCancel?: () => void;
}

const isSpecialTracksEnabled = import.meta.env.VITE_SPECIAL_TRACKS_ENABLED === 'true';

const EMPTY_FORM: TeamFormData = {
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
  communityHack: false,
  attendees: [],
};

export function TeamForm({
  teamData,
  teamId,
  isAdminView = false,
  onSuccess,
  onError,
  onCancel,
}: TeamFormProps) {
  const router = useAppNavigate();
  const { data: session } = useSession();
  const isCreateMode = !teamId;

  const { trigger: updateTeam, isMutating: isUpdating } = useTeamsPartialUpdate(teamId ?? '');
  const createMutation = useTeamsCreate();
  const deleteMutation = useTeamsDestroy(teamId ?? '');
  const isLoading = isUpdating || createMutation.isMutating || deleteMutation.isMutating;

  const [formData, setFormData] = useState<TeamFormData>(EMPTY_FORM);
  const [originalData, setOriginalData] = useState<TeamFormData | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tableOptions, setTableOptions] = useState<Table[] | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const formInitializedRef = useRef(false);
  const [isFormReady, setIsFormReady] = useState(isCreateMode);

  const canEditSpecialTracks = useMemo(
    () => isAdminView || isSpecialTracksEnabled,
    [isAdminView]
  );

  const requestConfig = useMemo(
    () => ({ swr: { enabled: !!session?.access_token } }),
    [session?.access_token]
  );

  const { tracks, hardwareTracks, isLoading: isTracksLoading } = useSpecialTracks();
  const { data: tables, isLoading: isTablesLoading, mutate: mutateTables } = useTablesList({}, requestConfig);
  const { data: teams, isLoading: isTeamsLoading } = useTeamsList({}, {
    swr: { enabled: !!session?.access_token && isAdminView },
  });

  const isDirty = useMemo(() => {
    if (!originalData) return true;
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }, [formData, originalData]);

  const attendeeTeamMap = useMemo(() => {
    if (!teams) return {} as Record<string, { id: string; name: string }>;
    const map: Record<string, { id: string; name: string }> = {};
    teams.forEach(team => {
      (team.attendees ?? []).forEach((attendeeId: string) => {
        map[attendeeId] = { id: team.id ?? '', name: team.name ?? '' };
      });
    });
    return map;
  }, [teams]);

  useEffect(() => {
    if (tables) {
      const filteredTables = tables.filter(
        table => !table.is_claimed || table.id === teamData?.table?.id
      );
      setTableOptions(filteredTables);
    }
  }, [tables, teamData?.table?.id]);

  const shouldValidateProject = useMemo(() => {
    return !!teamData?.project || !!formData.projectName || !!formData.description || !!formData.github || !!formData.devpost;
  }, [teamData?.project, formData.projectName]);

  // One-time initialization for edit mode — runs once all async data is ready
  useEffect(() => {
    if (formInitializedRef.current) return;
    if (!teamData || isTracksLoading) return;

    formInitializedRef.current = true;

    if (tracks.length < 1) toast.error('No tracks available');
    if (hardwareTracks.length < 1) toast.error('No hardware tracks available');
    // if (tableOptions.length < 1) toast.error('No tables available');

    const members: TeamMember[] = teamData.attendees.map((attendee: AttendeeName) => ({
      id: attendee.id || '',
      first_name: attendee.first_name || '',
      last_name: attendee.last_name || '',
      role: attendee.participation_role || '',
      profile_image: attendee.profile_image || { file: '' },
    }));
    setTeamMembers(members);

    const eventTracks = (teamData as unknown as { event_tracks?: EventTrack[] }).event_tracks;
    const eventHardware = (teamData as unknown as { event_destiny_hardware?: EventDestinyHardware[] }).event_destiny_hardware;

    const initialFormData: TeamFormData = {
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
      communityHack: (teamData as unknown as { community_hack?: boolean }).community_hack ?? false,
      attendees: teamData.attendees.map((attendee: AttendeeName) => ({
        id: attendee.id ?? '',
        first_name: attendee.first_name ?? '',
        last_name: attendee.last_name ?? '',
        checked_in_at: null,
      })),
    };

    setFormData(initialFormData);
    setOriginalData(initialFormData);
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
      location: table?.location as Location | null,
    } as TeamTable;
    updateFormData('selectedTable', mappedTable || null);
  }, [updateFormData]);

  const validateBaseForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    if (!formData.name.trim()) { newErrors.name = 'Please enter a team name'; isValid = false; }
    if (formData.attendees.length > 5) { newErrors.attendees = 'Teams cannot have more than five members'; isValid = false; }

    if (!isCreateMode) {
      if (!formData.selectedTable) { newErrors.selectedTable = 'Please select a table'; isValid = false; }
      if (!teamId) { newErrors.teamId = 'No team ID found'; isValid = false; }
    }
    
    if (shouldValidateProject) {
      if (!formData.projectName.trim()) { newErrors.projectName = 'Please enter a project name'; isValid = false; }
      if (!formData.description.trim()) { newErrors.description = 'Please enter a project description'; isValid = false; }
      if (!formData.github.trim()) { newErrors.github = 'Please enter a GitHub URL'; isValid = false; }
      if (!formData.devpost.trim()) { newErrors.devpost = 'Please enter a DevPost URL'; isValid = false; }
      if (!formData.github.trim().startsWith('https://')) {
        newErrors.github = 'GitHub URL must start with http:// or https://';
        isValid = false;
      }
      if (!formData.devpost.trim().startsWith('https://')) {
        newErrors.devpost = 'DevPost URL must start with http:// or https://';
        isValid = false;
      }
    }
    setErrors(newErrors);
    return isValid;
  }, [formData]);

  const handleReset = useCallback(() => {
    if (originalData) {
      setFormData(originalData);
      setErrors({});
    }
  }, [originalData]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteMutation.trigger();
      toast.success('Team deleted successfully');
      onSuccess?.(null);
      router.push('/admin/teams');
    } catch (error) {
      toast.error(`Error deleting team: ${error}`);
      onError?.(error);
    }
    setOpenDeleteDialog(false);
  }, [deleteMutation, onSuccess, onError, router]);

  const handleSaveChanges = async (): Promise<void> => {
    const isValid = validateBaseForm();
    if (!isValid) {
      toast.error(
        <ul className="list-disc pl-4 space-y-1 text-left">
          {Object.values(errors).filter(Boolean).map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      );
      return;
    };
    if (isAdminView) {
      const participantTeams = formData.attendees
        .map(attendee => {
          const team = attendeeTeamMap[attendee.id];
          if (!team || teamId === team.id) return undefined;
          return { teamName: team.name, participant: `${attendee.first_name} ${attendee.last_name}` };
        })
        .filter((t): t is { teamName: string; participant: string } => t !== undefined);

      if (participantTeams.length > 0) {
        toast.error(
          `Attendees cannot be on multiple teams: ${participantTeams.map(t => `Team: ${t.teamName} - ${t.participant}`).join(', ')}`
        );
        return;
      }

      if (!formData.attendees.length) {
        toast.error('Please add at least one attendee');
        return;
      }
    }

    try {
      if (isCreateMode) {
        const result = await createMutation.trigger({
          name: formData.name,
          attendees: formData.attendees.map(a => a.id),
          table: formData.selectedTable?.id || null,
        } as TeamCreateRequest);
        toast.success('Team created successfully');
        mutateTables();
        onSuccess?.(result as TeamOperationResult);
      } else {
        const tableRequest: TableRequestWithId = {
          id: formData.selectedTable!.id,
          number: formData.selectedTable!.number,
          location: formData.selectedTable!.location as LocationRequest,
        };

        const project = shouldValidateProject ? {
          name: formData.projectName,
            description: formData.description,
            repository_location: formData.github,
            submission_location: formData.devpost,
          } as ProjectRequest : null;

        await updateTeam({
          name: formData.name,
          attendees: formData.attendees.map(attendee => attendee.id),
          table: tableRequest,
          event_tracks: formData.selectedTracks,
          event_destiny_hardware: formData.selectedHardware,
          hardware_hack: formData.hardwareHack,
          startup_hack: formData.startupHack,
          community_hack: formData.communityHack,
          ...(project ? { project } : {}),
        } as PatchedTeamUpdateRequest);
        toast.success('Team updated successfully');
        mutateTables();
        setOriginalData(formData);
        onSuccess?.(null);
      }
    } catch (error) {
      toast.error(`Error saving team: ${error instanceof Error ? error.message : 'Unknown error'}`);
      onError?.(error);
    }
  };

  const renderTeamMembers = useMemo(() => {
    if (isAdminView) {
      return (
        <TeamRsvpAttendeeMultiSelect
          value={formData.attendees}
          onChange={newValue => updateFormData('attendees', newValue)}
          disabled={isLoading}
        />
      );
    }
    return teamMembers.map((attendee: TeamMember) => (
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
    ));
  }, [formData.attendees, teamMembers, isAdminView, isLoading, updateFormData]);

  if (!isFormReady) {
    return (
      <div className="flex flex-col items-start">
        <h1 className="text-md text-[#4D97E8] font-semibold">MANAGE TEAM</h1>
        <div className="mt-4 text-gray-600">Transforming data...</div>
      </div>
    );
  }

  const renderError = (error: string) => {
    return <span className="text-red-500 text-sm mt-1">{error}</span>;
  };

  return (
    <>
      {!isCreateMode && (
        <>
          <h1 className="text-md text-[#4D97E8] font-semibold">MANAGE TEAM</h1>
          <div className="text-xs/8 mb-8 md:mb-4 text-gray-800">
            Please note: all fields are required for submission. You can use placeholder URLs for DevPost and GitHub if you don't have one yet.
          </div>
        </>
      )}

      <div className="flex flex-col mb-4 w-full ">
        <label className="text-xs/8">TEAM NAME</label>
        <TextInput
          name="team-name"
          type="text"
          value={formData.name}
          onChange={e => updateFormData('name', e.target.value)}
          placeholder="Team Name"
        />
        {errors.name && renderError(errors.name)}
      </div>

      {!isCreateMode && (
        <>
          <div className="flex flex-col mb-4 w-full ">
            <label className="text-xs/8">DEVPOST</label>
            <TextInput
              name="devpost"
              type="text"
              value={formData.devpost}
              onChange={e => updateFormData('devpost', e.target.value)}
              placeholder="DevPost URL"
            />
            {errors.devpost && renderError(errors.devpost)}
          </div>

          <div className="flex flex-col mb-4 w-full ">
            <label className="text-xs/8">GITHUB</label>
            <TextInput
              name="github"
              type="text"
              value={formData.github}
              onChange={e => updateFormData('github', e.target.value)}
              placeholder="GitHub URL"
            />
            {errors.github && renderError(errors.github)}
          </div>
        </>
      )}

      <div className="flex flex-col mb-4 w-full  gap-3">
        {tableOptions ? (<Autocomplete
          id="table-select"
          value={getSelectedTableFromOptions(formData.tableId, tableOptions)}
          onChange={(event: unknown, newValue: Table | null | undefined) => {
            handleTableChange(newValue);
          }}
          options={tableOptions}
          getOptionLabel={option => getTableLabel(option)}
          getOptionKey={option => option?.id ?? ''}
          isOptionEqualToValue={(a, b) => a?.id === b?.id}
          renderInput={params => (
            <>
              <label className="text-xs/8">TABLE</label>
              <TextField {...params} size="small" className="w-1/2" />
            </>
          )}
        />) : <Loader size="h-12" loadingText="Loading tables..." />}
        {errors.selectedTable && renderError(errors.selectedTable)}
      </div>

      {!isCreateMode && (
        <div className="flex flex-col mb-4 w-full ">
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
          {errors.projectName && renderError(errors.projectName)}
          {errors.description && renderError(errors.description)}
        </div>
      )}

      {!isCreateMode && (
        <>
          <div className="flex flex-col mb-4 w-full ">
            <SpecialTrackSelect
              selectedTracks={formData.selectedTracks}
              onChange={(selectedTracks: string[]) => updateFormData('selectedTracks', selectedTracks)}
              options={tracks}
              maxSelections={1}
              limitSelection={false}
              labelClass="text-xs/8"
              type="track"
              disabled={!canEditSpecialTracks}
            />
            {errors.selectedTracks && renderError(errors.selectedTracks)}
          </div>
          <div className="flex flex-col mb-4 w-full ">
            <SpecialTrackSelect
              selectedTracks={formData.selectedHardware}
              onChange={(selectedHardware: string[]) => updateFormData('selectedHardware', selectedHardware)}
              options={hardwareTracks}
              maxSelections={3}
              limitSelection={false}
              labelClass="text-xs/8"
              type="hardware"
              disabled={!canEditSpecialTracks}
            />
            {errors.selectedHardware && renderError(errors.selectedHardware)}
          </div>
          <div className="flex flex-col mb-4 w-full">
            <label className="text-xs/8 mb-2">SPECIAL CATEGORIES</label>
            <div className="flex flex-col gap-1 md:flex-row">
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
              {errors.hardwareHack && renderError(errors.hardwareHack)}
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
              {errors.startupHack && renderError(errors.startupHack)}
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
                {errors.communityHack && renderError(errors.communityHack)}
            </div>
          </div>
        </>
      )}

      <div className="flex flex-col mb-4 w-full ">
        <label className="text-xs/8">TEAM MEMBERS</label>
        <div className="grid grid-cols-2 gap-4">
          {renderTeamMembers}
        </div>
          {errors.attendees && renderError(errors.attendees)}
      </div>

      {isAdminView ? (
        <div className="flex flex-row gap-2 w-full  pb-8">
          {onCancel && (
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-[6px] rounded-md text-sm font-light transition-all disabled:opacity-50"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
          {!isCreateMode && (
            <button
              className="bg-[#1677FF] hover:bg-[#0066F5] text-white px-4 py-[6px] rounded-md text-sm font-light transition-all disabled:opacity-50"
              onClick={handleReset}
              disabled={isLoading || !isDirty}
            >
              Reset
            </button>
          )}
          {!isCreateMode && (
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-[6px] rounded-md text-sm font-light transition-all disabled:opacity-50"
              onClick={() => setOpenDeleteDialog(true)}
              disabled={isLoading}
            >
              Delete
            </button>
          )}
          <button
            className="bg-[#1677FF] hover:bg-[#0066F5] text-white px-4 py-[6px] rounded-md text-sm font-light transition-all disabled:opacity-50"
            onClick={handleSaveChanges}
            disabled={isLoading || (!isCreateMode && !isDirty) || !formData.name.trim()}
          >
            {isLoading ? 'Saving...' : isCreateMode ? 'Create' : 'Save'}
          </button>
        </div>
      ) : (
        <div className="flex flex-row justify-between w-full  pb-8">
          <button
            className="bg-blue-400 text-white rounded-2xl p-2 text-xs pl-4 pr-4 disabled:opacity-50"
            onClick={handleSaveChanges}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this team? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button
            className="px-4 py-[6px] text-sm font-light"
            onClick={() => setOpenDeleteDialog(false)}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-[6px] rounded-md text-sm font-light disabled:opacity-50"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}
