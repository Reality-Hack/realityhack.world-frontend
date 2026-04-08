import { Track } from "@/hooks/useSpecialTracks";
import { BuildingEnum, Table, EventTrack, EventDestinyHardware } from "@/types/models";

/**
 * Convert event tracks from team data to array of UUIDs for form state.
 * The team data returns EventTrack[] objects, we extract the IDs.
 */
export const convertEventTracksFromTeamData = (
  eventTracks: EventTrack[] | undefined
): string[] => {
  if (!eventTracks || eventTracks.length === 0) return [];
  return eventTracks
    .map((track) => track.id)
    .filter((id): id is string => id !== undefined);
};

/**
 * Convert event destiny hardware from team data to array of UUIDs for form state.
 * The team data returns EventDestinyHardware[] objects, we extract the IDs.
 */
export const convertEventHardwareFromTeamData = (
  eventHardware: EventDestinyHardware[] | undefined
): string[] => {
  if (!eventHardware || eventHardware.length === 0) return [];
  return eventHardware
    .map((hw) => hw.id)
    .filter((id): id is string => id !== undefined);
};

/**
 * API may return EventDestinyHardware[] (nested) or string[] (ids). Normalize to id[] for forms.
 */
export function normalizeRelatesToEventDestinyHardwareIds(
  value: string[] | EventDestinyHardware[] | undefined,
): string[] {
  if (!value || value.length === 0) return [];
  if (typeof value[0] === 'string') {
    return value as string[];
  }
  return convertEventHardwareFromTeamData(value as EventDestinyHardware[]);
}

export const getSelectedTableFromOptions = (
  tableId: string | null,
  tableOptions: Table[] | null
): Table | null => {
  if (!tableId) return null;
  return tableOptions?.find(table => table.id === tableId) || null;
};

const buildingLabels: Record<string, string> = {
  [BuildingEnum.ST]: 'Stata',
  [BuildingEnum.WK]: 'Walker',
  [BuildingEnum.SC]: 'Student Center (Straton)',
  [BuildingEnum.BC]: 'Barcelona',
};

export const getTableLabel = (table: Table | undefined | null): string => {
  if (!table) return 'No table';
  
  const building = table.location?.building 
    ? buildingLabels[table.location.building] || 'Unknown' 
    : 'Unknown';
  
  return `${building}: Table #${table.number} ${table.notes}`;
};
