import { normalizeRelatesToEventDestinyHardwareIds } from '@/components/TeamForm/utils';
import type { EventDestinyHardware, HardwareCount, HardwareCreate } from '@/types/models';

type HardwareCountRow = HardwareCount & {
  relates_to_event_destiny_hardware?: string[] | EventDestinyHardware[];
};

export function hardwareCountToHardwareCreate(row: HardwareCount): HardwareCreate & {
  relates_to_event_destiny_hardware: string[];
} {
  const raw = (row as HardwareCountRow).relates_to_event_destiny_hardware;
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    image: row.image?.id ?? null,
    tags: row.tags,
    sponsor_company: row.sponsor_company ?? null,
    relates_to_destiny_hardware: row.relates_to_destiny_hardware ?? null,
    relates_to_event_destiny_hardware: normalizeRelatesToEventDestinyHardwareIds(raw),
  };
}

export function hardwareCountImageUrl(row: HardwareCount): string | null {
  return row.image?.file ?? null;
}
