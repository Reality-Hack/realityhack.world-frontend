'use client';
import {
  LightHouseMessage,
  Location,
  Table,
  getAllLocations,
  getAllTables
} from '@/app/api/lighthouse';
import LighthouseFloorView from '@/components/lighthouse/LighthouseFloorView';
import LighthouseTable from '@/components/lighthouse/LighthouseTable';
import { useSession } from 'next-auth/react';

import { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const LighthousesSocketURL = `${process.env.NEXT_PUBLIC_BACKEND_WS_URL}/ws/lighthouses/`;

export type LighthouseInfo = {
  location?: Location;
} & LightHouseMessage;

type UnlinkedTabProps = {
  isSelected: boolean;
  title: string;
  onClick: () => void;
};

/**
 * TODOs
 * X Move this to /lighthouses
 * If admin, full functionality
 * If mentor, disable Message Type to only Mentor Request, and disable multiselect
 * If neither admin nor mentor, remove buttons and disable any kind of select
 * Disable Grid View if not an admin
 * Handle bug with alert text field still showing
 */

function UnlinkedTab({ isSelected, title, onClick }: UnlinkedTabProps) {
  return isSelected ? (
    <span className="relative w-full mr-8" onClick={onClick}>
      <span className="cursor-pointer text-themePrimary before:content-[''] before:w-full before:absolute before:border-b-[2px] before:bottom-[-12px] before:bg-themePrimary before:border-themePrimary text-sm">
        {title}
      </span>
    </span>
  ) : (
    <span
      className="pr-8 text-sm transition-all cursor-pointer hover:text-themePrimary text"
      onClick={onClick}
    >
      {title}
    </span>
  );
}

export default function LightHouseControlCenter() {
  const [viewType, setViewType] = useState<'table' | 'floor'>('floor');

  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const [lighthouses, setLighthouses] = useState<LighthouseInfo[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const { sendJsonMessage, lastMessage, readyState } =
    useWebSocket(LighthousesSocketURL);

  const isAdmin = session && session?.roles?.includes('admin');
  const isMentor = session && session?.roles?.includes('mentor');

  useEffect(() => {
    setLoading(true);
    if (session?.access_token) {
      getAllTables(session.access_token).then(tables => {
        setTables(tables);
      });
      getAllLocations().then(locations => {
        setLocations(locations);
      });
    }
    setLoading(false);
  }, [session]);

  useEffect(() => {
    setLoading(true);
    if (lastMessage !== null) {
      const payload: LightHouseMessage[] | { message: LightHouseMessage } =
        JSON.parse(lastMessage.data);
      if (Array.isArray(payload)) {
        let lighthouseInfos = payload.map(lhMessage => {
          const table = tables.find(t => t.number === lhMessage.table);
          const location = locations.find(l => l.id === table?.location);
          return {
            ...lhMessage,
            location
          };
        });
        setLighthouses(lighthouseInfos);
      } else {
        let lighthouse = payload.message as LightHouseMessage;
        const table = tables.find(t => t.number === lighthouse.table);
        const location = locations.find(l => l.id === table?.location);
        let newLighthouse = {
          ...lighthouse,
          location
        };
        setLighthouses(prevLighthouses => {
          let newLighthouses = prevLighthouses.slice();
          let index = newLighthouses.findIndex(
            l => l.table === newLighthouse.table
          );
          if (index != -1) {
            newLighthouses[index] = newLighthouse;
          }
          return newLighthouses;
        });
      }
    }
    setLoading(false);
  }, [lastMessage, locations, tables]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated'
  }[readyState];

  return (
    <div className="h-screen p-6 pt-8 pl-2">
      <h1 className="text-3xl">Lighthouse Control Center</h1>
      <div className="py-4">
        <div className="pb-2">
          <UnlinkedTab
            isSelected={viewType === 'floor'}
            title="Floor View"
            onClick={() => setViewType('floor')}
          />
          {isAdmin && (
            <UnlinkedTab
              isSelected={viewType === 'table'}
              title="Grid View"
              onClick={() => setViewType('table')}
            />
          )}
        </div>
        <hr className="dark:border-borderDark" />
      </div>
      <span>The Lighthouse Connection is currently {connectionStatus}</span>
      <div className="pb-8">
        {viewType === 'floor' && (
          <LighthouseFloorView
            sendJsonMessage={sendJsonMessage}
            lighthouses={lighthouses}
            loading={loading}
            isAdmin={isAdmin ?? false}
            isMentor={isMentor ?? false}
          />
        )}
        {viewType === 'table' && (
          <LighthouseTable
            sendJsonMessage={sendJsonMessage}
            tables={tables}
            lighthouses={lighthouses}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
