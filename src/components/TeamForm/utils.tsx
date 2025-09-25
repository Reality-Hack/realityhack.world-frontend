import { Track } from "@/hooks/useSpecialTracks";
import { DestinyHardwareEnum, Table, TrackEnum } from "@/types/models";

export const convertTracksFromTeamData = (
    trackData: TrackEnum | TrackEnum[] | string | undefined,
    availableTracks: Track[]
  ): string[] => {
    if (!trackData || availableTracks.length === 0) return [];
    
    const trackValues = Array.isArray(trackData) 
      ? trackData 
      : typeof trackData === 'string' 
        ? trackData.split(',') 
        : [trackData];
        
    return trackValues
      .map((trackValue: string) => availableTracks.find(t => t.value[0] === trackValue))
      .filter((track: Track | undefined): track is Track => track !== undefined)
      .map((track: Track) => track.value);
  };

  export const convertHardwareFromTeamData = (
    hardwareData: DestinyHardwareEnum | DestinyHardwareEnum[] | string | undefined,
    availableHardware: Track[]
  ): string[] => {
    if (!hardwareData || availableHardware.length === 0) return [];
    
    const hardwareValues = Array.isArray(hardwareData) 
      ? hardwareData 
      : typeof hardwareData === 'string' 
        ? hardwareData.split(',') 
        : [hardwareData];
        
    return hardwareValues
      .map((hwValue: string) => availableHardware.find(h => h.value[0] === hwValue))
      .filter((hw: Track | undefined): hw is Track => hw !== undefined)
      .map((hw: Track) => hw.value);
  };


  export const getSelectedTableFromOptions = (tableId: string | null, tableOptions: Table[] | null): Table | null => {
    if (!tableId) return null;
    return tableOptions?.find(table => table.id === tableId) || null;
  };

  export const getTableLabel = (table: number | void): string => {
    if (!table) return `Table #${table}`;
    if (table <= 48) return `Walker: Table #${table}`;
    return `Stata: Table #${table}`;
  };