'use client';
import CustomSelect from '@/components/CustomSelect';
import { StatBox } from '@/components/helpQueue/hackerView/NewRequestComps';
import {
  Posting
} from '@/components/helpQueue/hackerView/PostingComps';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React, { useEffect, useState } from 'react';
import SelectToolWithOther from './SelectToolWithOther';
import FormattedTopicsAsList from '@/components/helpQueue/TopicFormatted';
import { useSession } from 'next-auth/react';
import { useAuthContext } from '@/hooks/AuthContext';
import { HelpRequestHistory, getAllHelpRequestsFromHistory } from '@/app/api/helpqueue';
import { MentorTopics, mentor_help_status, getKeyByValue } from '@/types/types';

export default function Page() {

  const { data: session } = useSession();
  const { user } = useAuthContext();
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // New state variable

  const tabNames = ['Open Requests', 'Accepted By Others', 'Completed'];
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (_event: any, newValue: number) => {
    setSelectedTab(newValue);
  };

  const [allHistoricalHelpRequests, setHistoricalHelpRequests] = useState<HelpRequestHistory[]>([]);

  const [selectedSkill, setSelectedSkill] = useState<string>(''); // State to store the selected skill
  function handleSkillSelection(selectedValue:string) {
    setSelectedSkill(selectedValue)
  }

    // //get all historical help requests
    useEffect(() => {
      console.log("making api call")
      if (session?.access_token) {
        getAllHelpRequestsFromHistory(session.access_token).then(
          historicalHelpReqs => {
            setHistoricalHelpRequests(historicalHelpReqs);
          }
        );
      }
    },[]);
  

    useEffect(() => {
      console.log(selectedItems)
    },[selectedItems])

  const SkillOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' }
  ];

  return (
    <div className="h-full flex flex-col gap-4 bg-gray-200 h-[800px] w-full overflow-y-auto p-2 rounded-lg">
      <div className="text-3xl">Help Queue</div>
      <div className="flex gap-4">
        <StatBox
          src="/icons/dashboard/help.png"
          label="Mentors Available"
          stat="9"
        />
      </div>
      <div>{JSON.stringify(allHistoricalHelpRequests[0])}</div>
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
      
      {/* <CustomSelect
        label={selectedSkill || "Select a Skill"}
        options={SkillOptions}
        value={selectedSkill}
        onChange={handleSkillSelection}
      /> */}
      <SelectToolWithOther placeholder='Type Question Filter' selectedItems={selectedItems} setSelectedItems={setSelectedItems} mentorTopics={Object.keys(MentorTopics).map(key =>
    key.replace(/_/g, ' ') || []
  )} canSubmit={()=>true} />
      <div>
        <div className='p-4'>
          <div className='flex flex-wrap w-20'>
          </div>
          {tabNames[selectedTab] == "Open Requests" && <div className='flex flex-wrap gap-2'>
            {
              allHistoricalHelpRequests.map((req, idx) => (
                <Posting
                  status={getKeyByValue(mentor_help_status, req.status) as string}
                  key={`posting-${idx}`}
                  requestTitle={req.title}
                  description={req.description?.slice(0, 5)}
                  placeInQueue={idx}
                  skillList={req.topic.map((topic) => getKeyByValue(MentorTopics, topic)?.replace(/_/g, ' ')) as string[]}
                  created={req.created_at}
                  team={req.team}
                />
              ))
            }
          </div>}
          {tabNames[selectedTab] == "Accepted By Others" && <div>B</div>}
          {tabNames[selectedTab] == "Completed" && <div>C</div>}
        </div>
      </div>
    </div>
  );
}
