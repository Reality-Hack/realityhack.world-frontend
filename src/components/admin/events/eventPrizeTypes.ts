import { EventDestinyHardware, EventTrack } from '@/types/models';

export type EventPrizeTrackItem = Pick<
  EventTrack,
  'id' | 'code' | 'name' | 'order' | 'sponsor_companies'
>;

export type PrizeTrackKind = 'prize' | 'hardware';

export function toPrizeTrackItem(
  item: EventTrack | EventDestinyHardware,
): EventPrizeTrackItem {
  return {
    id: item.id,
    code: item.code,
    name: item.name,
    order: item.order,
    sponsor_companies: item.sponsor_companies ?? [],
  };
}

export function nextPrizeTrackOrder(items: EventPrizeTrackItem[]): number {
  if (items.length === 0) {
    return 0;
  }
  return Math.max(...items.map((item) => item.order ?? 0)) + 1;
}
