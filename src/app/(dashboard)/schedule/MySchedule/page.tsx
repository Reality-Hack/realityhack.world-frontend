'use client';
import React, { useState } from 'react';
import {
  Room,
  LegendRoomProps,
  ScheduleRoomProps,
  DialogProps
} from '@/types/schedule-types';
import { getUserWorkshops } from '@/app/api/workshops';
import { User } from 'next-auth';
import ScheduleBox from '@/components/dashboard/schedule/ScheduleBox';

const LegendRoom: React.FC<LegendRoomProps> = ({ color, name }) => {
  return (
    <div className="flex flex-row gap-2 ml-2 content-center">
      <div
        style={{ backgroundColor: color }}
        className={`h-4 w-4 rounded`}
      ></div>
      <div>{name}</div>
    </div>
  );
};

const Page: React.FC = () => {
  const rooms: Room[] = [
    { color: 'red', name: 'Room 1' },
    { color: 'orange', name: 'Room 2' },
    { color: 'green', name: 'Room 3' }
  ];

  return (
    <div>
      <div className="flex flex-col gap-2 w-full">
        <div className="bg-white border-2 border-gray-200 flex flex-col gap-2 w-fill p-2 rounded-lg">
          <ScheduleBox />
          <div className="text-zinc-500 text-2xl font-normal font-['Inter'] leading-normal bg-white border-2 border-gray-200 flex flex-col gap-2 w-fit p-2 rounded-lg bg-neutral-50 rounded-[10px] shadow">
            Location Key
            {rooms.map(el => (
              <LegendRoom color={el.color} name={el.name} key={el.name} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
