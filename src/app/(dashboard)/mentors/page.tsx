'use client';
import {
  HelpRequest,
  HelpRequestTable,
  editMentorHelpRequest,
  getAllHelpRequests
} from '@/app/api/helpqueue';
import { MentorPosting } from '@/components/helpQueue/hackerView/PostingComps';
import { useAuth } from '@/contexts/AuthContext';
import { MentorTopics, getKeyByValue, mentor_help_status } from '@/types/types';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import SelectToolWithOther from './SelectToolWithOther';
const tabNames = [
  'Open Requests',
  'My Queue',
  'Accepted By Others',
  'Completed'
];

export default function Page() {
  const { data: session } = useSession();
  const isMentorOrAdmin =
    session &&
    ((session as any).roles?.includes('admin') ||
      (session as any).roles?.includes('mentor'));
  const { user } = useAuth();
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // New state variable

  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (_event: any, newValue: number) => {
    setSelectedTab(newValue);
  };

  const [allHelpRequests, setAllHelpRequests] = useState<HelpRequest[]>([]);

  const formattedOptions: { value: string; label: string }[] = [];

  for (const key in MentorTopics) {
    formattedOptions.push({
      label: key.replace(/_/g, ' '),
      value: MentorTopics[key as keyof typeof MentorTopics]
    });
  }

  // Function to fetch help requests
  const fetchHelpRequests = async () => {
    if (session?.access_token && isMentorOrAdmin) {
      const helpReqs = await getAllHelpRequests(session.access_token);
      setAllHelpRequests(helpReqs);
    }
  };

  const RoomsLabelsMap = {
    'MH': 'Morss Hall',
    'NE': 'Neptune',
    '24': '32-124',
    '44': '32-144',
    '41': '32-141',
    'AT': 'Atlantis' // for backwards compat with staging
  }

  const buildingLabelsMap = {
    'ST': 'Stata',
    'WK': 'Walker'
  }

  const getTableLabel = (table: HelpRequestTable | undefined) => {
    if (!table || !table.location) {
      return 'Team has removed their table.';
    }
    const building = table.location.building ? buildingLabelsMap[table.location.building as keyof typeof buildingLabelsMap] : 'Unknown';
    const room = table.location.room ? RoomsLabelsMap[table.location.room as keyof typeof RoomsLabelsMap] : 'Unknown';
    const number = table?.number ? table?.number : 'Unknown';
    if (!building || !room || !number) {
      return `Debug - Building: ${table?.location?.building}, Room: ${table?.location?.room}, Table: ${table?.number}`;
    }
    return `${building}, ${room}, Table ${number}`
  }

  useEffect(() => {
    fetchHelpRequests();
    // Set up periodic refresh every 30 seconds
    const intervalId = setInterval(fetchHelpRequests, 30000);
    
    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [session?.access_token, isMentorOrAdmin]);

  const handleUpdateStatus = (requestId: string) => async (status: string) => {
    if (!session || !isMentorOrAdmin) {
      return;
    }
    const updateData = {
      status: status,
      mentor: status === 'A' || status === 'E' ? user!.id : null
    };
    await editMentorHelpRequest(
      session!.access_token,
      requestId,
      updateData
    );
    // Fetch fresh data to ensure we have complete information
    await fetchHelpRequests();
  };

  const filteredHelpRequests = useMemo<HelpRequest[]>(() => {
    let result: HelpRequest[] = [];
    if (selectedTab === 0) {
      result = allHelpRequests.filter(r => r.status === 'R')
      if (selectedItems.length > 0) {
        result = result.filter(r => selectedItems.includes(r.topic[0]))
      }
    } else if (selectedTab === 1) {
      result = allHelpRequests.filter(r => r.mentor === user?.id);
    } else if (selectedTab === 2) {
      result = allHelpRequests.filter(
        r => r.status !== 'R' && r.status !== 'F' && r.mentor !== user?.id
      );
    } else if (selectedTab === 3) {
      result = allHelpRequests.filter(r => r.status === 'F');
    }
    return result;
  }, [selectedTab, selectedItems, user, allHelpRequests]);

  if (!isMentorOrAdmin) {
    return <div>Access Denied</div>;
  }

  function formatStatus(status: string) {
    return status
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
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
    <div className="flex flex-col h-full p-2 overflow-y-auto rounded-lg gap-4w-full">
      <div className="text-3xl">Mentor Help Queue</div>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        indicatorColor="secondary"
      >
        {tabNames.map((tabName, index) => {
          return (
            <Tab
              key={index}
              label={
                <span
                  className={`text-purple-900 text-xs transition-all ${
                    selectedTab === index ? 'font-medium' : 'font-medium'
                  }`}
                >
                  {tabName}
                </span>
              }
            />
          );
        })}
      </Tabs>
      <SelectToolWithOther
        canSubmit={() => true}
        mentorTopics={formattedOptions.map(option => option.label)}
        placeholder={'Select Your Skill'}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        formattedOptions={formattedOptions}
      />
      <div>
        <div className="p-4">
          <div className="flex flex-wrap w-20"></div>
          <div className="flex flex-wrap justify-center gap-2">
            {filteredHelpRequests?.map((req, idx) => {
              return (
                <MentorPosting
                  requestId={req.id}
                  status={formatStatus(
                    getKeyByValue(
                      mentor_help_status,
                      req.status ?? ''
                    ) as string
                  )}
                  key={`posting-${idx}`}
                  requestTitle={req.title}
                  description={req.description}
                  placeInQueue={idx + 1}
                  topicList={getTopicLabels(req.topic)}
                  created={req.created_at}
                  team={req.team?.id}
                  onHandleUpdateStatus={handleUpdateStatus(req.id)}
                  teamId={req.team?.id}
                  teamName={req.team?.name}
                  teamLocation={getTableLabel(req.team?.table)}
                  reporterLocation={req.reporter_location}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
