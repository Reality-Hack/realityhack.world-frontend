"use client"
import CustomSelect from '@/components/CustomSelect';
import { StatBox } from '@/components/helpQueue/HelpQueueComps';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React, {useState} from "react"

export default function Page() {
  const tabNames = ["Open Requests","Accepted By Others","Completed"]
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (_event: any, newValue: number) => {
    setSelectedTab(newValue);
  };

  function handleSkillSelection() {

  }

  const SkillOptions = [{value:"1",label:"1"},{value:"2",label:"2"}]

  return (
    <div className='flex flex-col gap-4'>
      <div className='text-3xl'>All Help Requests</div>
        <div className="flex gap-4">
          <StatBox src="/icons/dashboard/mentee_1.png" label="Active Requests" stat="9" />
          <StatBox src="/icons/dashboard/help.png" label="Mentors Available" stat="9" />
        </div>
        <CustomSelect
              label="Select a status"
              options={SkillOptions}
              value={info.getValue()}
              onChange={handleSkillSelection(info.row.original)}
            />     
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
    </div>
  );
}
