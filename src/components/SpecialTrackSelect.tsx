import { useState } from 'react';
import CustomSelectMultipleTyping, { Option } from './CustomSelectMultipleTyping';

interface SpecialTrackSelectProps {
  selectedTracks: string[];
  onChange: (tracks: string[]) => void;
  options: Option[];
  maxSelections?: number;
  labelClass?: string;
  type?: 'track' | 'hardware';
  limitSelection?: boolean;
  disabled?: boolean;
}

export function SpecialTrackSelect({ 
  selectedTracks, 
  onChange,
  options,
  limitSelection = true,
  maxSelections = 2,
  labelClass = '',
  type = 'track',
  disabled = false
}: SpecialTrackSelectProps) {
  const [warning, setWarning] = useState<string>('');

  const handleSelection = (selected: string[]) => {
    if (selected.length > maxSelections) {
      setWarning(`Please select up to ${maxSelections} ${type === 'track' ? 'tracks' : 'hardware'} only`);
      return;
    }
    setWarning('');
    onChange(selected);
  };

  const label = type === 'track' ? 'TOPICS' : 'TECHNOLOGIES';

  return (
    <div className="space-y-2">
      <div className={labelClass}>{label} {limitSelection ? `(Select up to ${maxSelections})` : ''}</div>
      {warning && <div className="text-lg text-red-400">{warning}</div>}
      <CustomSelectMultipleTyping
        width="100%"
        label={`Select ${type === 'track' ? 'track' : 'hardware'}`}
        options={options}
        value={selectedTracks}
        onChange={handleSelection}
        disabled={disabled}
      />
    </div>
  );
}
