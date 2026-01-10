import {
  CreateHelpRequest,
  HelpRequest,
  HelpRequestHistory,
  LightHouseMessage,
  Table,
  Team,
  addMentorHelpRequest,
  getAllHelpRequestsFromHistory,
  getAllMyTeamsHelpRequests,
  getAllTables
} from '@/app/api/helpqueue';
import { QuestionDialog } from '@/components/helpQueue/hackerView/NewRequestComps';
import { Posting } from '@/components/helpQueue/hackerView/PostingComps';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { MentorTopics } from '@/types/types';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { toast } from 'sonner';
const LighthousesSocketURL = `${process.env.NEXT_PUBLIC_BACKEND_WS_URL}/ws/lighthouses/`;


type LighthouseInfo = {
  location?: Location;
} & LightHouseMessage;

export default function Help2() {
  const { data: session } = useSession();
  const { user } = useAuth();

  const [myTable, setMyTable] = useState<Table>();
  const [allHelpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [allHistoricalHelpRequests, setHistoricalHelpRequests] = useState<
    HelpRequestHistory[]
  >([]);

  //layout logic
  const [showCompletedRequests, setShowCompletedRequests] = useState(0);
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
    // setShowCompletedRequests(prev => !prev);
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
    const token = session?.access_token;
    const teamId = user?.team?.id;

    if (token && teamId) {
      getAllMyTeamsHelpRequests(token, teamId)
        .then(helpReqs => {
          const sortedHelpReqs = helpReqs.sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );
          setHelpRequests(sortedHelpReqs);
        })
        .catch(err => {
          console.error('Error fetching team help requests:', err);
          toast.error('Failed to load help requests: ' + err.message);
        });
    }
  }, [session, user, showCompletedRequests]);

  //get tables
  useEffect(() => {
    const token = session?.access_token;
    if (user && token) {
      getAllTables(token).then(tables => {});
    }
  }, [user, session]);

  // //get all historical help requests
  useEffect(() => {
    const token = session?.access_token;
    const hasTeam = !!user?.team;

    if (token && hasTeam) {
      getAllHelpRequestsFromHistory(token)
        .then(historicalHelpReqs => {
          setHistoricalHelpRequests(historicalHelpReqs);
        })
        .catch(err => {
          console.error('Error fetching historical requests:', err);
        });
    }
  }, [user, session]);

  //subscribe to the websocket
  useEffect(() => {
    setLoading(true);
    if (lastMessage !== null) {
      const payload: LightHouseMessage[] | { message: LightHouseMessage } =
        JSON.parse(lastMessage.data);
      if (Array.isArray(payload)) {
        // console.log(
        //   'lighthouse messages: ',
        //   JSON.parse(lastMessage.data).filter(
        //     (el: LightHouseMessage) => el.mentor_requested
        //   )
        // );

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
  async function onNewHelpRequest(
    topics: string[],
    team: string,
    description?: string,
    reporter_location?: string,
    reporter?: string,
    category?: string,
    category_specialty?: string,
  ) {
    const token = session?.access_token;
    if (!token) {
      toast.error('Session missing. Please log in again.');
      return;
    }

    const newHelpRequest: CreateHelpRequest = {
      description: description,
      topic: topics,
      team: team,
      reporter_location: reporter_location
    };

    try {
      await addMentorHelpRequest(token, newHelpRequest);
      toast.success('Help request submitted!');
      if (setShowCompletedRequests) {
        setShowCompletedRequests(trigger => (trigger ?? 0) + 1);
      }
    } catch (error: any) {
      console.error('Error submitting help request:', error);
      toast.error('Failed to submit request: ' + error.message);
    }
  }

  const formattedOptions: any = [];

  for (const key in MentorTopics) {
    formattedOptions.push({
      label: key.replace(/_/g, ' '),
      value: MentorTopics[key as keyof typeof MentorTopics]
    });
  }

  const getTopicLabels = (topicIds: any) => {
    return topicIds.map((id: string) => {
      const option = formattedOptions.find(
        (option: any) => option.value === id
      );
      return option ? option.label : 'Unknown';
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        {/* <StatBox
          src="/icons/dashboard/mentee_1.png"
          label="Active Requests"
          stat="9"
        /> */}
      </div>
      <div className="flex justify-between mb-2">
        <div className="text-2xl"> Open Help Requests</div>
      </div>
      <hr />
      <div
        className="gap-1.5s mr-6 flex mt-0 mb-4 bg-[#1677FF] text-white px-4 py-[6px] rounded-md shadow my-4 font-light text-sm hover:bg-[#0066F5] cursor-pointer transition-all w-fit ml-auto"
        onClick={() => {
          if (user?.team?.table) {
            openNewRequestDialog();
          } else {
            toast.error('Your team must input your team location in "My Team" before requesting help.');
          }
        }}
      >
        New Help Request
      </div>

      <div className="flex flex-wrap justify-center gap-2 ">
        {allHelpRequests
          .filter(el => el.team?.id === user?.team?.id)
          .map((req, idx) => (
            <Posting
              key={req.id}
              status={req.status}
              requestTitle={req.title}
              description={req.description}
              placeInQueue={idx + 1}
              skillList={getTopicLabels(req.topic)}
              created={req.created_at}
              teamId={req.team.id}
              teamName={req.team.name}
              teamLocation={`${req.team.location?.building} ${req.team.location?.room}`}
              requestId={req.id}
              setShowCompletedRequests={setShowCompletedRequests}
              showAdditionalFields={true}
            />
          ))}
      </div>

      <div>
        <QuestionDialog
          isNewRequestDialogOpen={isNewRequestDialogOpen}
          closeNewRequestDialog={closeNewRequestDialog}
          onSubmit={onNewHelpRequest}
          setShowCompletedRequests={setShowCompletedRequests}
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
