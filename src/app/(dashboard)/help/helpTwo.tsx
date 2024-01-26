import {
  CreateHelpRequest,
  HelpRequest,
  HelpRequestHistory,
  LightHouseMessage,
  Table,
  Team,
  addMentorHelpRequest,
  getAllHelpRequests,
  getAllHelpRequestsFromHistory,
  getAllTables
  // getTeamIdFromAttendeeId
} from '@/app/api/helpqueue';
import {
  // CompletedPosting,
  // Posting,
  QuestionDialog,
  StatBox
} from '@/components/helpQueue/hackerView/NewRequestComps';
import {
  CompletedPosting,
  Posting
} from '@/components/helpQueue/hackerView/PostingComps';
import { useAuthContext } from '@/hooks/AuthContext';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { MentorTopics } from '@/types/types';
import useWebSocket, { ReadyState } from 'react-use-websocket';
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
      getAllHelpRequests(session.access_token).then(helpReqs => {
        // setTables(tables);
        setHelpRequests(helpReqs);
        console.log('helpReqs: ', helpReqs);
      });
    }
  }, [session]);

  //get tables
  useEffect(() => {
    if (user && session?.access_token) {
      getAllTables(session.access_token).then(tables => {});
    }
  }, [user]);

  // //get all historical help requests
  useEffect(() => {
    if (session?.access_token && user?.team) {
      getAllHelpRequestsFromHistory(session.access_token).then(
        historicalHelpReqs => {
          setHistoricalHelpRequests(historicalHelpReqs);
        }
      );
    }
  }, [user]);

  //subscribe to the websocket
  useEffect(() => {
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

        const myLighthouse = payload.find(l => l.table == myTable?.number);
        if (myLighthouse) {
          setLighthouse(myLighthouse);
        }
      } else {
        let lighthouse = payload.message as LightHouseMessage;
        const table = tables.find(t => t.number === lighthouse.table);

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
  function onNewHelpRequest(
    topics: string[],
    team: string,
    description?: string,
    reporter?: string,
    category?: string,
    category_specialty?: string
  ) {
    const newHelpRequest: CreateHelpRequest = {
      description: description,
      topic: topics,
      team: team
      // reporter: reporter,
      // category: category,
      // category_specialty:category_specialty,
    };
    if (session) {
      addMentorHelpRequest(session?.access_token, newHelpRequest);
    }
  }

  const formattedOptions: { label: string; value: string }[] = [];

  for (const key in MentorTopics) {
    formattedOptions.push({
      label: key.replace(/_/g, ' '),
      value: MentorTopics[key as keyof typeof MentorTopics]
    });
  }

  const getTopicLabels = (topicIds: any) => {
    return topicIds.map((id: string) => {
      const option = formattedOptions.find(option => option.value === id);
      return option ? option.label : 'Unknown';
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <StatBox
          src="/icons/dashboard/mentee_1.png"
          label="Active Requests"
          stat="9"
        />
      </div>
      <div className="flex justify-between mb-2">
        <div className="text-3xl"> Open Help Requests</div>
        <div
          className="gap-1.5s mr-6 flex mt-0 mb-4 bg-[#1677FF] text-white px-4 py-[6px] rounded-md shadow my-4 font-light text-sm hover:bg-[#0066F5] cursor-pointer transition-all"
          onClick={openNewRequestDialog}
        >
          New Help Request
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 ">
        {allHelpRequests
          .filter(el => el.team == user?.team?.id)
          .map((req, idx) => (
            <Posting
              status={myLighthouse?.mentor_requested}
              requestTitle={req.title}
              description={req.description?.slice(0, 5)}
              placeInQueue={idx}
              skillList={getTopicLabels(req.topics)}
              created={req.created_at}
              team={req.team}
            />
          ))}
      </div>

      <div>
        <div className="text-3xl"> HISTORICAL</div>
        <div className="font-medium">
          Show/Hide Completed Requests{' '}
          <span
            onClick={toggleCompletedRequests}
            className="transition-transform transform cursor-pointer hover:rotate-90"
          >
            {completedRequestsArrow}
          </span>
        </div>
        {showCompletedRequests && (
          <div className="flex flex-wrap gap-2">
            {allHistoricalHelpRequests
              .filter(el => el.team == user.team.id)
              .map(req => (
                <CompletedPosting
                  requestTitle={req.title}
                  description={req.description?.slice(0, 5)}
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
