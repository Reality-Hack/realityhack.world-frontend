import { ApplicationsListStatus } from '@/types/models';
import type { ApplicationsListParams } from '@/types/models';


export interface InviteFilterSet {
  label: string;
  params: ApplicationsListParams;
}

export const INVITE_FILTER_SETS = {
  unsent: {
    label: 'Unsent',
    params: {
      rsvp_unsent: true,
      status: ApplicationsListStatus.A
    } satisfies ApplicationsListParams,
  },
  unaccepted: {
    label: 'Unaccepted',
    params: {
      rsvp_unsent: false,
      has_rsvp: false,
    } satisfies ApplicationsListParams,
  },
} as const satisfies Record<string, InviteFilterSet>;

export type InviteFilterKey = keyof typeof INVITE_FILTER_SETS;

export const INVITE_FILTER_KEYS = Object.keys(INVITE_FILTER_SETS) as InviteFilterKey[];
