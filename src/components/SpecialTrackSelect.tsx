import { useState } from 'react';
import { useSpecialTracks } from '@/hooks/useSpecialTracks';
import CustomSelectMultipleTyping from './CustomSelectMultipleTyping';

interface SpecialTrackSelectProps {
  selectedTracks: string[];
  onChange: (tracks: string[]) => void;
  maxSelections?: number;
  labelClass?: string;
}

export function SpecialTrackSelect({ 
  selectedTracks, 
  onChange, 
  maxSelections = 2,
  labelClass = ''
}: SpecialTrackSelectProps) {
  const [warning, setWarning] = useState<string>('');
  const { tracks, isLoading, error } = useSpecialTracks();

  const handleSelection = (selected: string[]) => {
    if (selected.length > maxSelections) {
      setWarning(`Please select up to ${maxSelections} tracks only`);
      return;
    }
    setWarning('');
    onChange(selected);
  };

  if (isLoading) return <div>Loading tracks...</div>;
  if (error) return <div className="text-red-500">Error loading tracks: {error}</div>;

  return (
    <div className="space-y-2">
      <div className={labelClass}>PURPOSE TRACKS (Select {maxSelections})</div>
      {warning && <div className="text-lg text-red-400">{warning}</div>}
      <CustomSelectMultipleTyping
        width="100%"
        label="Select a status"
        options={tracks}
        value={selectedTracks}
        onChange={handleSelection}
      />
    </div>
  );
}
