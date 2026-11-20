'use client';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { toast } from 'sonner';
import { useEventsList } from '@/types/endpoints';
import { Event } from '@/types/models';
import { useAuth } from '@/contexts/AuthContext';
import Loader from '@/components/Loader';
import {
  clearGavelEvent,
  getGavelSyncStatus,
  GavelClearResult,
  GavelRecordCounts,
  GavelSyncLogEntry,
  GavelSyncResult,
  GavelSyncStatus,
  syncToGavel
} from '@/app/api/gavel';

const isMock = process.env.NEXT_PUBLIC_GAVEL_SYNC_MOCK === 'true';

const COUNT_COLUMNS: { key: keyof GavelRecordCounts; label: string }[] = [
  { key: 'created', label: 'Added' },
  { key: 'updated', label: 'Updated' },
  { key: 'unchanged', label: 'Unchanged' },
  { key: 'deactivated', label: 'Disabled' },
  { key: 'locked', label: 'Skipped (locked)' }
];

const formatDate = (date: string | null | undefined) =>
  date
    ? DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_SHORT)
    : 'Never';

const isClearResult = (
  result: GavelSyncResult | GavelClearResult
): result is GavelClearResult => 'deleted' in result;

function describeResult(result: GavelSyncResult | GavelClearResult | null) {
  if (!result) return '';
  if (isClearResult(result)) {
    return (
      `Deleted ${result.deleted.projects} projects and ${result.deleted.judges} judges; ` +
      `disabled ${result.deactivated.projects} projects and ${result.deactivated.judges} judges with votes`
    );
  }
  const part = (label: string, counts?: GavelRecordCounts) =>
    counts
      ? `${label}: ${counts.created} added, ${counts.updated} updated, ${counts.deactivated} disabled`
      : null;
  return [part('Projects', result.projects), part('Judges', result.judges)]
    .filter(Boolean)
    .join(' · ');
}

function SyncResultTable({ result }: { result: GavelSyncResult }) {
  const rows = [
    { label: 'Projects', counts: result.projects },
    { label: 'Judges', counts: result.judges }
  ].filter(row => row.counts);

  return (
    <table className="w-full text-sm text-left">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="py-2 pr-4 font-semibold" />
          {COUNT_COLUMNS.map(column => (
            <th key={column.key} className="py-2 pr-4 font-semibold">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.label} className="border-b border-gray-100">
            <td className="py-2 pr-4 font-semibold">{row.label}</td>
            {COUNT_COLUMNS.map(column => (
              <td key={column.key} className="py-2 pr-4">
                {row.counts?.[column.key] ?? 0}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function GavelSyncAdminPage() {
  const { data: session } = useSession();
  const { isAdmin, status: authStatus } = useAuth();
  const accessToken = session?.access_token;

  const { data: events, isLoading: isLoadingEvents } = useEventsList(
    {},
    {
      swr: { enabled: !!accessToken && isAdmin },
      request: {
        headers: {
          Authorization: `JWT ${accessToken}`
        }
      }
    }
  );

  const [eventId, setEventId] = useState<string>('');
  const [status, setStatus] = useState<GavelSyncStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [busyAction, setBusyAction] = useState<
    'preview' | 'sync' | 'clear' | null
  >(null);
  const [sendInvites, setSendInvites] = useState(false);
  const [lastResult, setLastResult] = useState<GavelSyncResult | null>(null);

  // default to the active event once events load
  useEffect(() => {
    if (!eventId && events?.length) {
      const active =
        events.find((event: Event) => event.is_active) ?? events[0];
      setEventId(active.id ?? '');
    }
  }, [events, eventId]);

  const loadStatus = useCallback(async () => {
    if (!accessToken || !eventId || !isAdmin) return;
    setIsLoadingStatus(true);
    try {
      setStatus(await getGavelSyncStatus(accessToken, eventId));
    } catch (error) {
      toast.error(`Couldn't load Gavel status: ${(error as Error).message}`);
    } finally {
      setIsLoadingStatus(false);
    }
  }, [accessToken, eventId, isAdmin]);

  useEffect(() => {
    setLastResult(null);
    loadStatus();
  }, [loadStatus]);

  const handleSync = async (dryRun: boolean) => {
    if (!accessToken) return;
    setBusyAction(dryRun ? 'preview' : 'sync');
    try {
      const result = await syncToGavel(accessToken, eventId, {
        dry_run: dryRun,
        send_invites: sendInvites
      });
      setLastResult(result);
      if (dryRun) {
        toast.success('Preview ready. Nothing has been changed in Gavel yet.');
      } else {
        toast.success('Synced to Gavel');
        if (result.invite_error) {
          toast.error(
            `Synced, but some invite emails failed: ${result.invite_error}`
          );
        }
        await loadStatus();
      }
    } catch (error) {
      toast.error(`Sync failed: ${(error as Error).message}`);
    } finally {
      setBusyAction(null);
    }
  };

  const handleClear = async () => {
    if (!accessToken) return;
    const confirmed = window.confirm(
      'Remove all projects and judges for this event from Gavel? ' +
        'Projects and judges that already have votes will be disabled instead of deleted.'
    );
    if (!confirmed) return;
    setBusyAction('clear');
    try {
      const result = await clearGavelEvent(accessToken, eventId);
      setLastResult(null);
      toast.success(describeResult(result));
      await loadStatus();
    } catch (error) {
      toast.error(`Clear failed: ${(error as Error).message}`);
    } finally {
      setBusyAction(null);
    }
  };

  if (authStatus === 'loading') {
    return <Loader />;
  }

  // NavGuard already redirects non-admins away from this page; this is a
  // second check in case the page is ever rendered without it
  if (!isAdmin) {
    return (
      <div className="p-6">You need to be an admin to manage judging sync.</div>
    );
  }

  if (isLoadingEvents) {
    return <Loader />;
  }

  const gavel = status?.gavel;
  const isBusy = busyAction !== null;

  return (
    <main className="p-6 flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-3xl">Judging Sync</h1>
        <div className="flex-1" />
        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          value={eventId}
          onChange={e => setEventId(e.target.value)}
          disabled={isBusy}
        >
          {events?.map((event: Event) => (
            <option key={event.id} value={event.id}>
              {event.name}
              {event.is_active ? ' (active)' : ''}
            </option>
          ))}
        </select>
      </div>

      {isMock && (
        <div className="rounded-md bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
          Using fake data (NEXT_PUBLIC_GAVEL_SYNC_MOCK=true). Nothing is sent to
          the backend or Gavel.
        </div>
      )}

      <p className="text-sm text-gray-600 max-w-3xl">
        Sends this event&apos;s projects (with their table locations) and judges
        to Gavel, the judging app. Syncing again updates what&apos;s there
        rather than creating duplicates. Projects or judges edited by hand in
        Gavel are left alone until they&apos;re unlocked there.
      </p>

      <section className="rounded-[10px] shadow bg-white p-6 flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Currently in Gavel</h2>
        {isLoadingStatus && !status ? (
          <Loader />
        ) : gavel ? (
          <div className="flex flex-wrap gap-8 text-sm">
            <div>
              <div className="text-gray-500">Last synced</div>
              <div className="text-lg">{formatDate(gavel.last_synced)}</div>
            </div>
            <div>
              <div className="text-gray-500">Projects (active / total)</div>
              <div className="text-lg">
                {gavel.projects.active} / {gavel.projects.total}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Judges (active / total)</div>
              <div className="text-lg">
                {gavel.judges.active} / {gavel.judges.total}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Locked by manual edits</div>
              <div className="text-lg">
                {gavel.projects.locked + gavel.judges.locked}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            This event hasn&apos;t been synced to Gavel yet.
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            className="bg-white border border-[#1677FF] text-[#1677FF] px-4 py-2 rounded-md text-sm hover:bg-blue-50 transition-all disabled:opacity-50"
            onClick={() => handleSync(true)}
            disabled={isBusy || !eventId}
          >
            {busyAction === 'preview' ? 'Previewing…' : 'Preview changes'}
          </button>
          <button
            className="bg-[#1677FF] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0066F5] transition-all disabled:opacity-50"
            onClick={() => handleSync(false)}
            disabled={isBusy || !eventId}
          >
            {busyAction === 'sync' ? 'Syncing…' : 'Sync now'}
          </button>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={sendInvites}
              onChange={e => setSendInvites(e.target.checked)}
              disabled={isBusy}
            />
            Email login links to newly added judges
          </label>
          <div className="flex-1" />
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-all disabled:opacity-50"
            onClick={handleClear}
            disabled={isBusy || !eventId || !gavel}
          >
            {busyAction === 'clear' ? 'Clearing…' : 'Clear Gavel data'}
          </button>
        </div>
      </section>

      {lastResult && (
        <section className="rounded-[10px] shadow bg-white p-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold">
              {lastResult.dry_run
                ? 'Preview: what a sync would change'
                : 'Sync complete'}
            </h2>
            <div className="flex-1" />
            {lastResult.dry_run && (
              <button
                className="bg-[#1677FF] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0066F5] transition-all disabled:opacity-50"
                onClick={() => handleSync(false)}
                disabled={isBusy}
              >
                Apply these changes
              </button>
            )}
          </div>
          {lastResult.dry_run && (
            <p className="text-sm text-gray-600">
              Nothing has been changed in Gavel yet.
            </p>
          )}
          <SyncResultTable result={lastResult} />
          {lastResult.invites_sent !== undefined && (
            <p className="text-sm text-gray-600">
              Sent login links to {lastResult.invites_sent} new judges.
            </p>
          )}
        </section>
      )}

      <section className="rounded-[10px] shadow bg-white p-6 flex flex-col gap-4">
        <h2 className="text-xl font-semibold">History</h2>
        {status?.history.length ? (
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 pr-4 font-semibold">When</th>
                <th className="py-2 pr-4 font-semibold">Action</th>
                <th className="py-2 pr-4 font-semibold">By</th>
                <th className="py-2 pr-4 font-semibold">Result</th>
              </tr>
            </thead>
            <tbody>
              {status.history.map((entry: GavelSyncLogEntry) => (
                <tr
                  key={entry.id}
                  className="border-b border-gray-100 align-top"
                >
                  <td className="py-2 pr-4 whitespace-nowrap">
                    {formatDate(entry.created_at)}
                  </td>
                  <td className="py-2 pr-4 capitalize">{entry.action}</td>
                  <td className="py-2 pr-4">{entry.triggered_by ?? '—'}</td>
                  <td
                    className={`py-2 pr-4 ${entry.status === 'error' ? 'text-red-600' : ''}`}
                  >
                    {entry.status === 'error'
                      ? entry.error
                      : describeResult(entry.result)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-sm text-gray-600">No syncs yet.</div>
        )}
      </section>
    </main>
  );
}
