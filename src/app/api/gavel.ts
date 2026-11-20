/**
 * Gavel judging sync. The backend pushes this event's projects and judges to
 * Gavel; these calls only talk to the backend, which holds the Gavel API token.
 *
 * Until the backend endpoints exist, set NEXT_PUBLIC_GAVEL_SYNC_MOCK=true to
 * use fake data. The response shapes below mirror what Gavel's own sync API
 * returns, which the backend passes through.
 */

export type GavelRecordCounts = {
  created: number;
  updated: number;
  unchanged: number;
  deactivated: number;
  locked: number;
};

export type GavelRecordTotals = {
  total: number;
  active: number;
  locked: number;
};

export type GavelEventSummary = {
  external_id: string;
  name: string;
  last_synced: string | null;
  projects: GavelRecordTotals;
  judges: GavelRecordTotals;
};

export type GavelSyncResult = {
  dry_run: boolean;
  event: GavelEventSummary;
  projects?: GavelRecordCounts;
  judges?: GavelRecordCounts;
  invites_sent?: number;
  invite_error?: string;
};

export type GavelClearResult = {
  event: GavelEventSummary;
  deleted: { projects: number; judges: number };
  deactivated: { projects: number; judges: number };
};

export type GavelSyncLogEntry = {
  id: string;
  created_at: string;
  triggered_by: string | null;
  action: 'sync' | 'clear';
  status: 'success' | 'error';
  error: string | null;
  result: GavelSyncResult | GavelClearResult | null;
};

export type GavelSyncStatus = {
  // null when the event has never been synced to Gavel
  gavel: GavelEventSummary | null;
  history: GavelSyncLogEntry[];
};

export type GavelSyncOptions = {
  dry_run?: boolean;
  send_invites?: boolean;
};

const isMock = process.env.NEXT_PUBLIC_GAVEL_SYNC_MOCK === 'true';

async function request<T>(
  accessToken: string,
  path: string,
  method: 'GET' | 'POST',
  body?: object
): Promise<T> {
  const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + accessToken
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!resp.ok) {
    let message = `${resp.status} ${resp.statusText}`;
    try {
      const data = await resp.json();
      message = data.error || data.detail || message;
    } catch {
      // response wasn't JSON; keep the status text
    }
    throw new Error(message);
  }
  return resp.json();
}

/**
 * getGavelSyncStatus: fetches what's currently in Gavel for an event, plus
 * the history of syncs
 */
export async function getGavelSyncStatus(
  accessToken: string,
  eventId: string
): Promise<GavelSyncStatus> {
  if (isMock) return mock.status(eventId);
  return request(accessToken, `/events/${eventId}/gavel-sync`, 'GET');
}

/**
 * syncToGavel: pushes the event's projects and judges to Gavel. With
 * dry_run, reports what would change without changing anything.
 */
export async function syncToGavel(
  accessToken: string,
  eventId: string,
  options: GavelSyncOptions = {}
): Promise<GavelSyncResult> {
  if (isMock) return mock.sync(eventId, options);
  return request(accessToken, `/events/${eventId}/gavel-sync`, 'POST', options);
}

/**
 * clearGavelEvent: removes the event's projects and judges from Gavel.
 * Records that already have votes are disabled instead of deleted.
 */
export async function clearGavelEvent(
  accessToken: string,
  eventId: string
): Promise<GavelClearResult> {
  if (isMock) return mock.clear(eventId);
  return request(accessToken, `/events/${eventId}/gavel-clear`, 'POST');
}

// Fake backend for building the UI before the real endpoints exist. Keeps
// state in memory so syncing and clearing behave plausibly until reload.
const mock = (() => {
  const delay = () => new Promise(resolve => setTimeout(resolve, 600));
  const state: Record<string, GavelSyncStatus> = {};
  const empty = (): GavelRecordTotals => ({ total: 0, active: 0, locked: 0 });
  const get = (eventId: string) =>
    (state[eventId] ??= { gavel: null, history: [] });
  const log = (
    eventId: string,
    action: GavelSyncLogEntry['action'],
    result: GavelSyncLogEntry['result']
  ) => {
    get(eventId).history.unshift({
      id: Math.random().toString(36).slice(2),
      created_at: new Date().toISOString(),
      triggered_by: 'you (mock)',
      action,
      status: 'success',
      error: null,
      result
    });
  };

  return {
    async status(eventId: string): Promise<GavelSyncStatus> {
      await delay();
      return structuredClone(get(eventId));
    },
    async sync(
      eventId: string,
      options: GavelSyncOptions
    ): Promise<GavelSyncResult> {
      await delay();
      const current = get(eventId);
      const first =
        current.gavel === null || current.gavel.projects.total === 0;
      const result: GavelSyncResult = {
        dry_run: !!options.dry_run,
        event: {
          external_id: eventId,
          name: 'Reality Hack (mock)',
          last_synced: options.dry_run
            ? (current.gavel?.last_synced ?? null)
            : new Date().toISOString(),
          projects: { total: 42, active: 40, locked: first ? 0 : 1 },
          judges: { total: 18, active: 18, locked: 0 }
        },
        projects: first
          ? { created: 42, updated: 0, unchanged: 0, deactivated: 0, locked: 0 }
          : {
              created: 1,
              updated: 3,
              unchanged: 36,
              deactivated: 2,
              locked: 1
            },
        judges: first
          ? { created: 18, updated: 0, unchanged: 0, deactivated: 0, locked: 0 }
          : {
              created: 0,
              updated: 0,
              unchanged: 18,
              deactivated: 0,
              locked: 0
            },
        invites_sent:
          options.send_invites && !options.dry_run && first ? 18 : undefined
      };
      if (!options.dry_run) {
        current.gavel = result.event;
        log(eventId, 'sync', result);
      }
      return structuredClone(result);
    },
    async clear(eventId: string): Promise<GavelClearResult> {
      await delay();
      const current = get(eventId);
      const result: GavelClearResult = {
        event: {
          external_id: eventId,
          name: current.gavel?.name ?? 'Reality Hack (mock)',
          last_synced: current.gavel?.last_synced ?? null,
          projects: empty(),
          judges: empty()
        },
        deleted: {
          projects: current.gavel?.projects.total ?? 0,
          judges: current.gavel?.judges.total ?? 0
        },
        deactivated: { projects: 0, judges: 0 }
      };
      current.gavel = result.event;
      log(eventId, 'clear', result);
      return structuredClone(result);
    }
  };
})();
