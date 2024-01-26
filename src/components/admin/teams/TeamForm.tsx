'use client';

import { Attendee, getAllAttendees } from '@/app/api/attendee';
import { Table, getAllTables } from '@/app/api/table';
import { SerializedTeam } from '@/app/api/team';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import { useSession } from 'next-auth/react';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type TeamFormProps = {
  team: SerializedTeam;
  onChange: (team: SerializedTeam) => void;
};

function getTableLabel(table: number | void) {
  if (!table) {
    return `Table #${table}`;
  }
  if (table <= 68) {
    return `Media Lab: Table #${table}`;
  } else {
    return `Walker: Table #${table}`;
  }
}

export default function TeamForm({ team, onChange }: TeamFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [attendeeOptions, setAttendeeOptions] = useState<Attendee[]>([]);
  const [tableOptions, setTableOptions] = useState<Table[]>([]);

  const { data: session } = useSession();
  const isAdmin = session && session.roles?.includes('admin');

  const getData = useCallback(async () => {
    setLoading(true);
    if (isAdmin && session?.access_token) {
      const attendeesResult = await getAllAttendees(session?.access_token);
      setAttendeeOptions(attendeesResult);
      const tablesResult = await getAllTables(session?.access_token);
      setTableOptions(tablesResult);
    }
    setLoading(false);
  }, [session?.access_token, isAdmin]);

  useEffect(() => {
    getData();
  }, [team, getData]);

  const changeName = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    onChange({ ...team, name });
  };

  const changeTable = (table: Table | undefined | null) => {
    onChange({ ...team, table: table ?? undefined });
  };

  const changeAttendees = (attendees: Attendee[] | null) => {
    onChange({ ...team, attendees: attendees ?? [] });
  };

  return (
    <div className="flex flex-col gap-4">
      <TextField
        name="team_name"
        label="Team Name"
        type="text"
        value={team.name}
        onChange={changeName}
        required={true}
        fullWidth={true}
        size="small"
      />
      <Autocomplete
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
      />
      <Autocomplete
        multiple
        id="attendees-select"
        options={attendeeOptions}
        value={team.attendees}
        onChange={(event: any, newValue: Attendee[] | null) => {
          changeAttendees(newValue);
        }}
        size="small"
        fullWidth={true}
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
              key={option.id}
            />
            {`${option.first_name} ${option.last_name}`}
          </li>
        )}
        renderTags={(value: readonly Attendee[], getTagProps) =>
          value.map((option: Attendee, index: number) => (
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
            label="Attendees"
            placeholder="Add Attendees"
          />
        )}
      />
    </div>
  );
}
