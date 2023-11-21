import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export interface Option {
  value: string;
  label: string;
}

export interface CustomSelectProps {
  id?: string;
  label: string;
  options: Option[];
  value: string;
  onChange: (event: SelectChangeEvent) => void;
  disabled?: boolean;
}

export default function CustomSelect({
  id,
  label,
  options,
  value,
  onChange,
  disabled
}: CustomSelectProps) {
  return (
    <FormControl fullWidth variant="outlined" size="small">
      <InputLabel id={id ?? 'custom-select-label'}>{label}</InputLabel>
      <Select
        labelId={id ?? 'custom-select-label'}
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value ?? ''}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
