'use client';
import { HelpRequest, getAllHelpRequests } from '@/app/api/helpqueue';
import { MentorPosting } from '@/components/helpQueue/hackerView/PostingComps';
import { useAuthContext } from '@/hooks/AuthContext';
import { MentorTopics, getKeyByValue, mentor_help_status } from '@/types/types';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import SelectToolWithOther from './SelectToolWithOther';

export default function Page() {
  const { data: session } = useSession();
  const { user } = useAuthContext();
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // New state variable

  const tabNames = ['Open Requests', 'Accepted By Others', 'Completed'];
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (_event: any, newValue: number) => {
    setSelectedTab(newValue);
  };

  const [allHelpRequests, setAllHelpRequests] = useState<HelpRequest[]>([]);
  // const [allHistoricalHelpRequests, setHistoricalHelpRequests] = useState<
  //   HelpRequestHistory[]
  // >([]);

  const [selectedSkill, setSelectedSkill] = useState<string>(''); // State to store the selected skill
  function handleSkillSelection(selectedValue: string) {
    setSelectedSkill(selectedValue);
  }

  const formattedOptions = [];

  for (const key in MentorTopics) {
    formattedOptions.push({
      label: key.replace(/_/g, ' '),
      value: MentorTopics[key as keyof typeof MentorTopics]
    });
  }

  // //get all help requests
  useEffect(() => {
    console.log('making api call');
    if (session?.access_token) {
      getAllHelpRequests(session.access_token).then(helpReqs => {
        setAllHelpRequests(helpReqs);
      });
    }
  }, []);

  return (
    <div className="h-full flex flex-col gap-4 bg-gray-200 h-[800px] w-full overflow-y-auto p-2 rounded-lg">
      <div className="text-3xl">Help Queue</div>
      <div className="text-2xl">Help Requests</div>
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
                    selectedTab === index ? 'font-semibold' : 'font-medium'
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
          {tabNames[selectedTab] == 'Open Requests' && (
            <div className="flex flex-wrap gap-2">
              {session?.access_token &&
                allHelpRequests.map((req, idx) => {
                  return (
                    <MentorPosting
                      access_token={session.access_token}
                      requestId={req.id}
                      status={
                        getKeyByValue(mentor_help_status, req.status) as string
                      }
                      key={`posting-${idx}`}
                      requestTitle={req.title}
                      description={req.description?.slice(0, 5)}
                      placeInQueue={idx}
                      topicList={
                        req.topics?.map(topic =>
                          getKeyByValue(MentorTopics, topic)?.replace(/_/g, ' ')
                        ) as string[]
                      }
                      created={req.created_at}
                      team={req.team}
                    />
                  );
                })}
            </div>
          )}
          {tabNames[selectedTab] == 'Accepted By Others' && <div>B</div>}
          {tabNames[selectedTab] == 'Completed' && <div>C</div>}
        </div>
      </div>
    </div>
  );
}
