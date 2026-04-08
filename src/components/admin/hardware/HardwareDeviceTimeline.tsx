import Loader from '@/components/Loader';
import type { HardwareDevice, HardwareDeviceHistory, HardwareRequestList } from "@/types/models";
import { useHardwaredevicehistoryList, useHardwarerequestsList } from "@/types/endpoints";
import { useMemo } from "react";

function formatHistoryTimestamp(iso: string | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function sortHistoryNewestFirst(rows: HardwareDeviceHistory[]): HardwareDeviceHistory[] {
  return [...rows].sort((a, b) => {
    const idA = a.history_id ?? 0;
    const idB = b.history_id ?? 0;
    if (idA !== idB) return idB - idA;
    const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return tB - tA;
  });
}

export default function HardwareDeviceTimeline({ device }: { device: HardwareDevice }) {
  const historyListParams =
  device && device.id
    ? { id: device.id }
    : undefined;
  const {
    data: historyRows,
    isLoading: historyLoading,
    error: historyError,
  } = useHardwaredevicehistoryList(historyListParams, {
    swr: {
      enabled: Boolean(device && historyListParams),
    },
  });

  const historySorted = useMemo(
    () => sortHistoryNewestFirst(historyRows ?? []),
    [historyRows],
  );

  const { data: hardwareRequests, isLoading: isLoadingHardwareRequests, error: hardwareRequestsError } = useHardwarerequestsList();

  const hardwareRequestsById = useMemo(() => {
    return hardwareRequests?.reduce((acc, request) => {
      if (request.id) {
        acc[request.id] = request;
      }
      return acc;
    }, {} as Record<string, HardwareRequestList>);
  }, [hardwareRequests]);

  const renderHistoryRow = (currentState: HardwareDeviceHistory, previousState: HardwareDeviceHistory | null) => {
    if (currentState.history_type === '+') {
      return <span>Device created</span>
    }
    if (previousState?.checked_out_to && !currentState.checked_out_to) {
      return <span>Device returned</span>
    }
    const changeStates: string[] = [];
    if (currentState.serial !== previousState?.serial) {
      changeStates.push('Device serial changed');
    }
    if (currentState.hardware !== previousState?.hardware) {
      changeStates.push('Hardware type changed');
    }

    const renderChangeStates = () => {
      return changeStates.map((state) => {
        return <div className="text-gray-600">{state}</div>
      })
    }
    if (!changeStates.length && !currentState.checked_out_to) {
      return (
        <div className="flex flex-col gap-1">
          <div className="text-gray-800">Saved with no changes</div>
        </div>
      )
    }
    if (currentState.checked_out_to) {
      const hardwareRequest = hardwareRequestsById?.[currentState.checked_out_to];
      if (!hardwareRequest) {
        return (
        <div className="flex flex-col gap-1">
          <div className="text-gray-800">Request not found</div>
          <div className="flex flex-col gap-1">
            {renderChangeStates()}
          </div>
        </div>
        )
      }

      const renderLabel = (label: string, value: string) => {
        return (
          <div className="flex flex-row gap-1">
            <div className="text-gray-800">
              {label}:
            </div>
            <div className="font-bold text-gray-600">{value}</div>
          </div>
        )
      }
      return (
        <div className="flex flex-col gap-1">
          <div>
            {renderLabel('Participant', `${hardwareRequest.requester?.first_name || 'No First Name'} ${hardwareRequest.requester?.last_name || 'No Last Name'}`)}
          </div>
          <div>
            {renderLabel('Team', hardwareRequest.team?.name || 'No Team')}
          </div>
          <div>
            {renderLabel('Team Number', hardwareRequest.team?.number?.toString() || 'No Team Number')}
          </div>
          <div className="flex flex-col gap-1">
            {renderChangeStates()}
          </div>
        </div>
      )
    }
    return (
      <div className="flex flex-col gap-1">
        {renderChangeStates()}
      </div>
    );
  }
  const renderLoadingSpinner = () => {
    let message = '';
    if (historyLoading) {
      message = 'Loading history…';
    }
    if (isLoadingHardwareRequests) {
      message = 'Loading hardware requests…';
    }
    if (message) {
      return <Loader loadingText={message} size="h-12" direction="flex-row" />;
    }
    return null;
  }
  const renderError = () => {
    let message = '';
      if (historyError) {
      message = 'Could not load history.';
    }
    if (hardwareRequestsError) {
      message = 'Could not load hardware requests.';
    }
    if (message) {
      return (
        <div className="flex flex-row gap-2 items-center justify-center">
          <span className="text-sm text-red-600">{message}</span>
        </div>
      );
    }
    return null;
  }
  const renderHistory = () => {
    if (historySorted.length === 0) {
      return <span className="text-sm text-gray-500">No history entries yet.</span>
    }
    return (
      <ul className="max-h-48 overflow-y-auto rounded-md border border-gray-200 p-2">
        {historySorted.map((row, index) => (
          <li
            key={row.history_id ?? `${row.updated_at ?? ''}`}
            className="border-b border-gray-100 py-2 text-xs last:border-b-0 last:pb-0 first:pt-0"
          >
            <div className="grid md:grid-cols-2 gap-2 grid-cols-1">
              <div className="flex flex-col gap-1">
                <div className="font-medium text-gray-800">
                  {formatHistoryTimestamp(row.updated_at)}
                </div>
                <div className="text-gray-800 md:py-2 py-1"> 
                  Serial: {row.serial}
                </div>
              </div>
              <div className="mt-0.5 text-gray-600 flex flex-row min-w-1/2">
                {renderHistoryRow(row, index < historySorted.length - 1 ? historySorted[index + 1] : null)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="flex flex-col gap-2 border-t border-gray-200 pt-4">
      <span className="text-sm font-medium text-gray-700">History</span>
      {renderLoadingSpinner() || renderHistory()}
      {renderError()}
    </div>
  );
}