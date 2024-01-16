'use client';
import {
  LightHouseMessage,
  Location,
  Table,
  Team,
  getAllLocations,
  getAllHelpRequests,
  getAllHelpRequestsFromHistory,
  getAllTeams,
  getAllTables
} from '@/app/api/lighthouse';
import TableComponent from '@/components/Table';
import { HelpRequestHistory, HelpRequest } from '@/app/api/lighthouse';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useSession } from 'next-auth/react';
import { HTMLProps, useEffect, useMemo, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const LighthousesSocketURL = `${process.env.NEXT_PUBLIC_BACKEND_WS_URL}/ws/lighthouses/`;

type LighthouseInfo = {
  location?: Location;
} & LightHouseMessage;

export default function LighthouseTable() {
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const [lighthouses, setLighthouses] = useState<LighthouseInfo[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [allHelpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const { sendMessage, lastMessage, readyState } =
    useWebSocket(LighthousesSocketURL);

  //get help requests, teams, and locations
  // help reqs - team
  // team - table (which is a table location)
  // tables - numbers
  useEffect(() => {
    if (session?.access_token) {
      console.log('use effect 0');
      getAllHelpRequests(session.access_token).then(helpReqs => {
        // setTables(tables);
        console.log('setting help requests: ', helpReqs);
        setHelpRequests(helpReqs);
        // console.log("tables: " , tables)
      });

      getAllTeams().then((teamsss: Team | Team[]) => {
        setTeams(Array.isArray(teamsss) ? teamsss : [teamsss]);
      });

      getAllLocations().then(locations => {
        setLocations(locations);
        console.log('locations: ', locations);
      });
    }
  }, [session]);

  useEffect(() => {
    console.log('use effect 1 ');
    setLoading(true);
    if (lastMessage !== null) {
      const payload: LightHouseMessage[] | { message: LightHouseMessage } =
        JSON.parse(lastMessage.data);
      if (Array.isArray(payload)) {
        console.log(
          'lighthouse messages: ',
          JSON.parse(lastMessage.data).filter((el: LightHouseMessage) => el.mentor_requested)
          );
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
        let newLighthouses = lighthouses.slice();
        let index = newLighthouses.findIndex(
          l => l.table === newLighthouse.table
        );
        if (index != -1) {
          newLighthouses[index] = newLighthouse;
        }
        setLighthouses(newLighthouses);
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
    <>
      <div className="z-50 px-6 py-6 bg-[#FCFCFC] border-gray-300 rounded-2xl">
        <span>The Lighthouse Connection is currently {connectionStatus}</span>

        <div className="h-[629px] overflow-y-scroll z-50 rounded-l border border-[#EEEEEE]">
          {'hello'}
          <div className="flex flex-col gap-1">
            {allHelpRequests.map(request => (
              <Box helpReqId={request.title} tableId={'table'} />
            ))}
          </div>
          <div className="flex flex-col">
            <div>
              {'help request team: '} {JSON.stringify(allHelpRequests[0]?.team)}
              {'QUEUE POSITION'}{' '}
              {allHelpRequests.findIndex(
                obj => obj.team == '45d57bec-a242-497f-b17c-203fa38e80ae'
              )}
            </div>
            <div>
              {'team table location: '}
              {JSON.stringify(teams[0]?.table)} {'table number: '}{' '}
              {locations.findIndex(obj => obj.id == teams[0]?.table)}
            </div>
            <div className="flex gap-4">
              {'table ID'}
              <div>
                {JSON.stringify(locations[0]?.id)}
                {'table number: '}
                {JSON.stringify(locations[0]?.number)}
              </div>
            </div>
            {/* {teams.filter((el) => elJSON.stringify(allHelpRequests[0].team))} */}
          </div>
        </div>
      </div>
    </>
  );
}
type Box = {
    helpReqId?: string;
    tableId:string;
} 
  
function Box({ helpReqId, tableId }:Box) {
  return (
    <div className="flex flex-row gap-4 border-2 rounded-md mx-2">
      <div>{tableId}</div>
      <div>{helpReqId}</div>
    </div>
  );
}
