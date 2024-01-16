import {
  HelpRequest,
  HelpRequestHistory,
  LightHouseMessage,
  Table,
  Team,
  getAllHelpRequests,
  getAllHelpRequestsFromHistory,
  getAllMyTeamsHelpRequests,
  getAllMyTeamsHistoricalHelpRequests,
  getAllTables,
  getAllTeams,
  getTeamIdFromAttendeeId
} from '@/app/api/helpqueue';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
  CompletedPosting,
  Posting,
  QuestionDialog,
  StatBox
} from '@/components/helpQueue/HelpQueueComps';
import jwtDecode from 'jwt-decode';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const LighthousesSocketURL = `${process.env.NEXT_PUBLIC_BACKEND_WS_URL}/ws/lighthouses/`;

type LighthouseInfo = {
  location?: Location;
} & LightHouseMessage;


export default function Help2() {
  const { data: session } = useSession();
  const [myTeam, setMyTeam] = useState<Team>();
  const [myTable, setMyTable] = useState<Table>();
  const [myId, setMyId] = useState<String>();
  const [allHelpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [allHistoricalHelpRequests, setHistoricalHelpRequests] = useState<
    HelpRequestHistory[]
  >([]);
  const exampleSkillList = ['React', 'JavaScript', 'CSS', 'Node.js'];

  const [showCompletedRequests, setShowCompletedRequests] = useState(true);
  const [isNewRequestDialogOpen, setNewRequestDialogOpen] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const { sendMessage, lastMessage, readyState } =
  useWebSocket(LighthousesSocketURL);

  const [lighthouses, setLighthouses] = useState<LighthouseInfo[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const toggleCompletedRequests = () => {
    setShowCompletedRequests(prev => !prev);
  };

  const completedRequestsArrow = showCompletedRequests ? '▼' : '▶';

  const openNewRequestDialog = () => {
    setNewRequestDialogOpen(true);
  };

  const closeNewRequestDialog = () => {
    setNewRequestDialogOpen(false);
  };

  //get my personal team info
  useEffect(() => {
    if (session?.access_token) {
      const id: string = jwtDecode(session.access_token);
      const devId = "d0d8e1d7-67d9-4be5-8c60-eb4d36296572"
      setMyId(devId)
      getTeamIdFromAttendeeId(devId).then(team => {
        setMyTeam(team[0]); //this is because team comes in as an array
      });
    }
  });

  // get our help requests
  useEffect(() => {
    if (myTeam?.id && session?.access_token ) {
      getAllHelpRequests(session.access_token).then(helpReqs => {
        // setTables(tables);
        setHelpRequests(helpReqs);
      });
    }
  });

  // //get all historical help requests
  useEffect(() => {
    if (session?.access_token && myTeam) {
      getAllHelpRequestsFromHistory(session.access_token).then(
        historicalHelpReqs => {
          setHistoricalHelpRequests(historicalHelpReqs);
        }
      );
    }
  });

  //set myTable value
  useEffect(() => {
    if (session?.access_token) {
      getAllTables(session.access_token).then(tables => {
        setTables(tables)
        setMyTable(tables.find((table)=>table.id == myTeam?.table))
      })
    }
  })

  //subscribe to the websocket
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
        //MAKE API CALL
        //make api call to get the helpQueue again only if the table matched the team's table
        //OR JUST UPDATE THE QUESTION STATUS BASED OFF THE LIGHTHOUSE MESSAGE
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
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <StatBox
          src="/icons/dashboard/mentee_1.png"
          label="Active Requests"
          stat="9"
        />
        <StatBox
          src="/icons/dashboard/help.png"
          label="Mentors Available"
          stat="9"
        />
      </div>
      <div className="flex mb-2">
        <div className="text-4xl font-semibold"> Open Help Requests</div>
        <div
          className="bg-red-200 ml-auto p-2 cursor-pointer rounded-2xl mx-2"
          onClick={openNewRequestDialog}
        >
          New Help Request
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {allHelpRequests.filter(el=>el.team=="628232c5-95c7-4728-8776-a90eea8f666e").map((req, idx) => (
          <Posting
            requestTitle={req.title}
            description={req.description.slice(0, 5)}
            placeInQueue={idx}
            skillList={exampleSkillList}
            created={req.created_at}
            team={req.team}
          />
        ))}
      </div>

      <div>
        <div className="text-4xl font-semibold"> HISTORICAL</div>
        <div className="font-semibold">
          Show/Hide Completed Requests{' '}
          <span
            onClick={toggleCompletedRequests}
            className="cursor-pointer transform hover:rotate-90 transition-transform"
          >
            {completedRequestsArrow}
          </span>
        </div>
        {showCompletedRequests && (
          <div className="flex flex-wrap gap-2">
            {allHistoricalHelpRequests.filter(el=>el.team=="628232c5-95c7-4728-8776-a90eea8f666e").map((req, idx) => (
              <CompletedPosting
                requestTitle={req.title}
                description={req.description.slice(0, 5)}
                skillList={exampleSkillList}
                created={req.created_at}
              />
            ))}
          </div>
        )}
        <QuestionDialog
          isNewRequestDialogOpen={isNewRequestDialogOpen}
          closeNewRequestDialog={closeNewRequestDialog}
        />{' '}
      </div>
    </div>
  );
}

function findTeamByAttendeeId(attendeeId: string, teams: Team[]): string {
  for (let team of teams) {
    if (team.attendees.includes(attendeeId)) {
      return team.name;
    }
  }
  return 'Attendee not found in any team';
}
