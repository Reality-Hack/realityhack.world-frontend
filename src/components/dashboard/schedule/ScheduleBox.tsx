/* eslint-disable react/no-unescaped-entities */
'use client';
import React, { useState, useEffect } from 'react';
import { getAttendee } from '@/app/api/attendee';
import { getUserWorkshops } from '@/app/api/workshops';
import ScheduleRoom from './ScheduleItem';
import TimeComponent from './TimeComponent';
import { useAuthContext } from '@/hooks/AuthContext';

export default function ScheduleBox() {
  //fetch the users added semiars/workshops
  //add them to a state that updates whenever there is a change detected in the workshops
  //render them out using a map function
  const { user } = useAuthContext();
  const [userEvents, setUserEvents] = useState();
  let timeSlots = [];
  for(let i=0;i<14;i++){
    timeSlots.push(i);
  }

  async function fetchUserWorkshops() {
    console.log(user)
    const userWorkshops = await getUserWorkshops(user.id);
    console.log(userWorkshops)
  }

  const dummyData = [
    {
      workshopName: 'vr for dummies',
      location: 'iQH 3f',
      color: 'red',
      time: '9am',
      duration: 3,
      description: 'vr for people with no experience'
    },
    {
      workshopName: 'vr for adepties',
      location: 'iQH 3f',
      color: 'blue',
      time: '4pm',
      duration: 3,
      description: 'vr for people with experience'
    },
    {
      workshopName: "vr for genius'",
      location: 'iQH 2f',
      color: 'green',
      time: '11am',
      duration: 5,
      description: 'vr for people too much experience'
    },
    {
      workshopName: "making the gremlins'",
      location: 'iQH 6f',
      color: 'yellow',
      time: '3pm',
      duration: 2,
      description: 'gremlins'
    }
  ];

  return (
    <div>
      <div className="">
        <div className="w-[100%] h-[100%] bg-neutral-50 rounded-[10px] shadow overflow-x-scroll">
          <span className="text-zinc-500 text-2xl font-normal font-['Inter'] leading-normal mt-6 ml-3 ">
            Schedule
          </span>
          <div className="p-4 rounded-[10px] min-w-[1000px] overflow-x-auto">
            <div
              style={{
                gridTemplateColumns: 'repeat(14, .25fr)',
                gridTemplateRows: 'repeat(8, 1fr)',
                rowGap: '15px'
              }}
              className="grid grid-rows-8 grid-cols-14"
            >
              {timeSlots.map(slot => (
                <TimeComponent time={slot} />
              ))}
              {dummyData.map(data => (
                <ScheduleRoom
                  color={data.color}
                  location={data.location}
                  duration={data.duration}
                  workshopName={data.workshopName}
                  description={data.description}
                  time={data.time}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="origin-top-left -rotate-90 translate-y-[-500%] text-zinc-500 text-base font-light font-['Inter'] leading-normal tracking-[2.88px]">
        Monday January 25
      </div>
    </div>
  );
}
