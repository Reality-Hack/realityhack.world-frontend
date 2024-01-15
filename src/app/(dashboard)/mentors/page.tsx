'use client';
import CustomSelect from '@/components/CustomSelect';
import { Posting, StatBox } from '@/components/helpQueue/HelpQueueComps';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React, { useState } from 'react';

export default function Page() {
  const tabNames = ['Open Requests', 'Accepted By Others', 'Completed'];
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (_event: any, newValue: number) => {
    setSelectedTab(newValue);
  };

  const [selectedSkill, setSelectedSkill] = useState<string>(''); // State to store the selected skill
  function handleSkillSelection(selectedValue:string) {
    setSelectedSkill(selectedValue)
  }

  const SkillOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' }
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="text-3xl">Help Queue</div>
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
      <CustomSelect
        label={selectedSkill || "Select a Skill"}
        options={SkillOptions}
        value={selectedSkill}
        onChange={handleSkillSelection}
      />
      {tabNames[selectedTab] == "Open Requests" && <div>
        <Posting 
          requestTitle="Fip Title"
          description="Description"
          skillList={["a","b"]}
        />  
      </div>}
      {tabNames[selectedTab] == "Accepted By Others" && <div>B</div>}
      {tabNames[selectedTab] == "Completed" && <div>C</div>}
    </div>
  );
}
