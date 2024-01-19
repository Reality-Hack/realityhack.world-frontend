import {
  CreateHelpRequest,
  HelpRequest,
  HelpRequestHistory,
  LightHouseMessage,
  Table,
  Team,
  addMentorHelpRequest,
  editMentorHelpRequest,
  getAllHelpRequests,
  getAllHelpRequestsFromHistory,
  getAllMyTeamsHelpRequests,
  getAllMyTeamsHistoricalHelpRequests,
  getAllTables,
  getAllTeams,
  getTable,
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
import { getMe } from '@/app/api/attendee';
import { useAuthContext } from '@/hooks/AuthContext';

const LighthousesSocketURL = `${process.env.NEXT_PUBLIC_BACKEND_WS_URL}/ws/lighthouses/`;

type LighthouseInfo = {
  location?: Location;
} & LightHouseMessage;

// export enum MentorRequestStatus {
//   REQUESTED = 'R',
//   ACKNOWLEDGED = 'A',
//   EN_ROUTE = 'E',
//   RESOLVED = 'F'
// }

export default function Help2() {
  const { data: session } = useSession();
  const { user } = useAuthContext();

  const [myTable, setMyTable] = useState<Table>();
  const [myId, setMyId] = useState<String>();
  const [allHelpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [allHistoricalHelpRequests, setHistoricalHelpRequests] = useState<
    HelpRequestHistory[]
  >([]);
  const exampleSkillList = ['React', 'JavaScript', 'CSS', 'Node.js'];

  //layout logic
  const [showCompletedRequests, setShowCompletedRequests] = useState(true);
  const [isNewRequestDialogOpen, setNewRequestDialogOpen] = useState(false);

  //websocket state/hooks
  const [loading, setLoading] = useState<boolean>(false);
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `${LighthousesSocketURL}`
  );

  const [lighthouses, setLighthouses] = useState<LighthouseInfo[]>([]);
  const [myLighthouse, setLighthouse] = useState<LighthouseInfo>();
  const [tables, setTables] = useState<Table[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  // console.log(session?.access_token)
  //layout components logic
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

  // get our help requests
  useEffect(() => {
    if (session?.access_token) {
      console.log("ppokpokpokpopokpokpokpokpokpok")
      getAllHelpRequests(session.access_token).then(helpReqs => {
        // setTables(tables);
        setHelpRequests(helpReqs);
      });
    }
  },[session]);

  //get tables
  useEffect(() => {
    if (user && session?.access_token) {
      getAllTables(session.access_token).then(tables => {
        // setTables(tables);
        // setTables(tables);
        const mytable = tables.find(t => t.id == user.team.table)
        console.log(mytable)
        setMyTable(mytable)
      });
    }
  },[user]);

  // //get all historical help requests
  useEffect(() => {
    if (session?.access_token && user?.team) {
      getAllHelpRequestsFromHistory(session.access_token).then(
        historicalHelpReqs => {
          setHistoricalHelpRequests(historicalHelpReqs);
        }
      );
    }
  },[user]);

  //set myTable value
  // useEffect(() => {
  //   if (session?.access_token) {
  //     if (user) {
  //       getTable(session.access_token, user.team.table).then(table => {
  //         setMyTable(table);
  //         console.log("fetched table:", table)
  //       });
  //     }
  //   }
  // },[user]);

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
          JSON.parse(lastMessage.data).filter(
            (el: LightHouseMessage) => el.mentor_requested
          )
        );
        
        const myLighthouse = payload.find(
          l => l.table == myTable?.number
          );
        if (myLighthouse) {
          setLighthouse(myLighthouse);
        }
      } else {
        let lighthouse = payload.message as LightHouseMessage;
        const table = tables.find(t => t.number === lighthouse.table);
        const location = locations.find(l => l.id === table?.location);
        if (table == myTable?.number) {
          setLighthouse(lighthouse);
        }
      }
    }
    setLoading(false);
  }, [myTable, lastMessage, locations, tables]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated'
  }[readyState];

// mentorhelprequestpost endpoint
  function onNewHelpRequest(team: string, topics: string[], description?: string, reporter?: string, category?: string, category_specialty?:string )  {
    const newHelpRequest : CreateHelpRequest = {
      description:description,
      topics:topics,
      team:team,
      category:category,
      category_specialty:category_specialty,
    }
    if (session?.access_token){
        addMentorHelpRequest(session?.access_token, newHelpRequest)
    }
  }
  function onEditToHelpRequest(team: string, topics: string[], description?: string, reporter?: string, category?: string, category_specialty?:string )  {
    const editedHelpRequest : CreateHelpRequest = {
      description:description,
      topics:topics,
      team:team,
      category:category,
      category_specialty:category_specialty,
    }
    if (session?.access_token){
        editMentorHelpRequest(session?.access_token, editedHelpRequest)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {JSON.stringify(allHelpRequests[0])}
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
        {allHelpRequests
          .filter(el => el.team == user.team.id)
          .map((req, idx) => (
            <Posting
              status={myLighthouse?.mentor_requested}
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
            {allHistoricalHelpRequests
              .filter(el => el.team == user.team.id)
              .map((req, idx) => (
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
          onSubmit={onNewHelpRequest}
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
