import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { TierEnum } from '@/types/models';

export const TIER_LABELS: Record<TierEnum, string> = {
  EC: 'Ecosystem',
  T1: 'Tier 1',
  T2: 'Tier 2',
  T3: 'Tier 3',
  T4: 'Tier 4',
  T5: 'Tier 5',
};

type SponsorTierSelectProps = {
  value: TierEnum | '';
  onChange: (value: TierEnum | '') => void;
};

export function SponsorTierSelect({ value, onChange }: SponsorTierSelectProps) {
  const handleChange = (e: SelectChangeEvent) => onChange(e.target.value as TierEnum | '');

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>Tier</InputLabel>
      <Select value={value} label="Tier" onChange={handleChange}>
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {Object.entries(TIER_LABELS).map(([tierValue, label]) => (
          <MenuItem key={tierValue} value={tierValue}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
