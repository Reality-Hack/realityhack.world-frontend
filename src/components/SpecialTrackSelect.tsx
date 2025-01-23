import { useState } from 'react';
import { useSpecialTracks } from '@/hooks/useSpecialTracks';
import CustomSelectMultipleTyping from './CustomSelectMultipleTyping';

interface SpecialTrackSelectProps {
  selectedTracks: string[];
  onChange: (tracks: string[]) => void;
  maxSelections?: number;
  labelClass?: string;
  type?: 'track' | 'hardware';
}

export function SpecialTrackSelect({ 
  selectedTracks, 
  onChange, 
  maxSelections = 2,
  labelClass = '',
  type = 'track'
}: SpecialTrackSelectProps) {
  const [warning, setWarning] = useState<string>('');
  const { tracks, hardwareTracks, isLoading, error } = useSpecialTracks();

  const handleSelection = (selected: string[]) => {
    if (selected.length > maxSelections) {
      setWarning(`Please select up to ${maxSelections} ${type === 'track' ? 'tracks' : 'hardware'} only`);
      return;
    }
    setWarning('');
    console.log(`Selected ${type}:`, selected);
    onChange(selected);
  };

  if (isLoading) return <div>Loading {type === 'track' ? 'tracks' : 'hardware'}...</div>;
  if (error) return <div className="text-red-500">Error loading {type === 'track' ? 'tracks' : 'hardware'}: {error}</div>;

  const options = type === 'track' ? tracks : hardwareTracks;
  const label = type === 'track' ? 'TOPICS' : 'TECHNOLOGIES';

  return (
    <div className="space-y-2">
      <div className={labelClass}>{label} (Select {maxSelections})</div>
      {warning && <div className="text-lg text-red-400">{warning}</div>}
      <CustomSelectMultipleTyping
        width="100%"
        label={`Select ${type === 'track' ? 'track' : 'hardware'}`}
        options={options}
        value={selectedTracks}
        onChange={handleSelection}
      />
    </div>
  );
}
