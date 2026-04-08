'use client';
import { useMemo } from 'react';
import { Autocomplete, Checkbox, Chip, TextField } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useSession } from '@/auth/client';
import { useEventrsvpsAttendeeOptionsList } from '@/types/endpoints';
import type { EventRsvpAttendeeOption } from '@/types/models';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface TeamRsvpAttendeeMultiSelectProps {
  value: EventRsvpAttendeeOption[];
  onChange: (value: EventRsvpAttendeeOption[]) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
}

export function TeamRsvpAttendeeMultiSelect({
  value,
  onChange,
  disabled = false,
  label = 'Attendees',
  placeholder = 'Add Attendees',
}: TeamRsvpAttendeeMultiSelectProps) {
  const { data: session } = useSession();

  const { data: options, isLoading } = useEventrsvpsAttendeeOptionsList({
    swr: { enabled: !!session?.access_token },
  });

  const attendeeOptions = useMemo(() => options ?? [], [options]);

  return (
    <Autocomplete
      multiple
      id="attendees-select"
      options={attendeeOptions}
      value={value}
      onChange={(_event, newValue) => onChange(newValue ?? [])}
      size="small"
      fullWidth
      disabled={disabled || isLoading}
      disableCloseOnSelect
      getOptionLabel={option => `${option.first_name} ${option.last_name}`}
      getOptionKey={option => option.id}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      renderOption={(props, option, { selected }) => (
        <li {...props} key={option.id}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {`${option.first_name} ${option.last_name}${option.checked_in_at ? '' : ' (Not Checked In)'}`}
        </li>
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            label={`${option.first_name} ${option.last_name}`}
            key={option.id}
          />
        ))
      }
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
        />
      )}
    />
  );
}
