'use client';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from 'antd';
import { useSession } from 'next-auth/react';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { TeamDetail, TeamTable } from '@/types/models';
import { TeamCreateRequest, TeamRequest } from '@/types/models';
import { useTeamsCreate, useTeamsUpdate, useTeamsDestroy } from '@/types/endpoints';
import { TeamOperationResult } from '@/types/types2';
import LinearProgress from '@mui/material/LinearProgress';
import { useEventRsvps, AttendeeWithCheckIn } from '@/hooks/useEventRsvps';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />

type TeamFormData = {
  name: string;
  attendees: AttendeeWithCheckIn[]; 
  table?: { id: string } | TeamTable | null;
};

type TeamFormProps = {
  initialData?: TeamDetail;
  onSuccess?: (team: TeamOperationResult | null) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
};

export default function TeamForm({ initialData, onSuccess, onError, onCancel }: TeamFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { 
    rsvpAttendeesWithCheckIn: attendees,
    isLoading: attendeesLoading,
  } = useEventRsvps();
  const isEdit = !!initialData?.id;

  const [formData, setFormData] = useState<TeamFormData>(() => ({
    name: initialData?.name || '',
    attendees: (initialData?.attendees || []).map(a => ({ ...a, checked_in_at: null })),
    table: initialData?.table || null
  }));

  const [originalData, setOriginalData] = useState<TeamFormData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const createMutation = useTeamsCreate({
    request: {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'JWT ' + session?.access_token
      }
    }
  });

  const updateMutation = useTeamsUpdate(initialData?.id || '', {
    request: {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'JWT ' + session?.access_token
      }
    }
  });

  const deleteMutation = useTeamsDestroy(initialData?.id || '', {
    request: {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'JWT ' + session?.access_token
      }
    }
  });

  const isLoading = createMutation.isMutating || updateMutation.isMutating || deleteMutation.isMutating;

  useEffect(() => {
    if (initialData) {
      const data = {
        name: initialData.name,
        attendees: (initialData.attendees || []).map(a => ({ ...a, checked_in_at: null })),
        table: initialData.table || null
      };
      setFormData(data);
      setOriginalData(data);
    }
  }, [initialData]);

  const attendeeOptions = useMemo((): AttendeeWithCheckIn[] => {
    if (!attendees) return [];
    return attendees;
  }, [attendees]);

  const isDirty = useMemo(() => {
    console.group('isDirty')
    console.log('originalData', originalData)
    console.log('formData', formData)
    if (!originalData) return true;
    console.log('JSON.stringify(formData)', JSON.stringify(formData))
    console.log('JSON.stringify(originalData)', JSON.stringify(originalData))
    console.log('JSON.stringify(formData) !== JSON.stringify(originalData)', JSON.stringify(formData) !== JSON.stringify(originalData))
    console.groupEnd()
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }, [formData, originalData]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
    }

    if (formData.attendees.length > 5) {
      newErrors.teamLength = 'Teams cannot have more than five members'
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setFormData(prev => ({ ...prev, name }));
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const handleAttendeesChange = (attendees: AttendeeWithCheckIn[] | null) => {
    setFormData(prev => ({ ...prev, attendees: attendees || [] }));
  };

  const handleSave = useCallback(async () => {
    if (!validateForm()) return;
    if (!formData.attendees.length) {
      toast.error('Please add at least one attendee');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Please enter a team name');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        attendees: formData.attendees.map(a => a.id),
        table: formData.table?.id || null
      };

      let result: TeamOperationResult;
      if (isEdit) {
        result = await updateMutation.trigger(payload as TeamRequest);
      } else {
        result = await createMutation.trigger(payload as TeamCreateRequest);
      }

      if (result) {
        toast.success(`Team ${isEdit ? 'updated' : 'created'} successfully`);
        onSuccess?.(result);
      }
    } catch (error) {
      const errorMessage = `Error ${isEdit ? 'updating' : 'creating'} team: ${error}`;
      toast.error(errorMessage);
      onError?.(error);
    }
  }, [formData, validateForm, isEdit, updateMutation, createMutation, onSuccess, onError]);

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
      onSuccess?.(null as any);
      router.push('/admin/teams');
    } catch (error) {
      const errorMessage = `Error deleting team: ${error}`;
      toast.error(errorMessage);
      onError?.(error);
    }
    setOpenDeleteDialog(false);
  }, [deleteMutation, onSuccess, onError]);

  if (attendeesLoading) {
    return <LinearProgress />;
  }

  return (
    <div className="flex flex-col gap-4">
      <TextField
        name="team_name"
        label="Team Name"
        type="text"
        value={formData.name}
        onChange={handleNameChange}
        error={!!errors.name}
        helperText={errors.name}
        required={true}
        fullWidth={true}
        size="small"
        disabled={isLoading}
      />
      {/* <Autocomplete
        id="table-select"
        value={team.table}
        loading={loading}
        onChange={(event: any, newValue: Table | null | undefined) => {
          changeTable(newValue);
        }}
        options={tableOptions}
        getOptionLabel={option => getTableLabel(option?.number)}
        getOptionKey={option => option?.id ?? ''}
        isOptionEqualToValue={(a, b) => a?.id === b?.id}
        renderInput={params => (
          <TextField {...params} label="Table" size="small" />
        )}
      /> */}
      <Autocomplete
        multiple
        id="attendees-select"
        options={attendeeOptions}
        value={formData.attendees}
        onChange={(event: any, newValue: AttendeeWithCheckIn[] | null) => {
          handleAttendeesChange(newValue);
        }}
        size="small"
        fullWidth={true}
        disabled={isLoading || attendeesLoading}
        disableCloseOnSelect
        getOptionLabel={option => `${option.first_name} ${option.last_name}`}
        getOptionKey={option => option.id as string}
        isOptionEqualToValue={(a, b) => a.id === b.id}
        renderOption={(props, option, { selected }) => (
          <li {...props} key={option.id}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
              key={option.id}
            />
            {`${option.first_name} ${option.last_name} ${option.checked_in_at ? '' : '(Not Checked In)'}`}
          </li>
        )}
        renderTags={(value: readonly AttendeeWithCheckIn[], getTagProps) =>
          value.map((option: AttendeeWithCheckIn, index: number) => (
            <Chip
              {...getTagProps({ index })}
              label={`${option.first_name} ${option.last_name} `}
              key={option.id}
            />
          ))
        }
        renderInput={params => (
          <TextField
            {...params}
            label="Attendees"
            placeholder="Add Attendees"
          />
        )}
      />

      {/* Error display */}
      {(createMutation.error || updateMutation.error || deleteMutation.error || errors.teamLength) && (
        <Alert severity="error">
          {createMutation.error?.message || updateMutation.error?.message || deleteMutation.error?.message || errors.teamLength}
        </Alert>
      )}

      {/* Action buttons */}
      <div className="m-2 float-right flex gap-1">
        {onCancel && (
          <button
            className="gap-1.5s flex mt-0 mb-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-[6px] rounded-md shadow my-4 font-light text-sm transition-all"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
        {initialData &&
          <button
            className="gap-1.5s flex mt-0 mb-4 bg-[#1677FF] text-white px-4 py-[6px] rounded-md shadow my-4 font-light text-sm hover:bg-[#0066F5] transition-all disabled:opacity-50"
            onClick={handleReset}
            disabled={isLoading || !isDirty}
          >
            Reset
          </button>
        }
        {isEdit && (
          <button
            className="gap-1.5s flex mt-0 mb-4 bg-red-600 hover:bg-red-700 text-white px-4 py-[6px] rounded-md shadow my-4 font-light text-sm transition-all disabled:opacity-50"
            onClick={() => setOpenDeleteDialog(true)}
            disabled={isLoading}
          >
            Delete
          </button>
        )}
        <button
          className="gap-1.5s flex mt-0 mb-4 bg-[#1677FF] text-white px-4 py-[6px] rounded-md shadow my-4 font-light text-sm hover:bg-[#0066F5] transition-all disabled:opacity-50"
          onClick={handleSave}
          disabled={isLoading || !isDirty || !formData.name.trim()}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this team? It cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
