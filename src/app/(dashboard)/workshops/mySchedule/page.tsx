'use client';
import React, { useState, useEffect } from 'react';
import {
  Room,
  LegendRoomProps,
  ScheduleRoomProps,
  DialogProps,
  WorkshopAttendeeListItem
} from '@/types/schedule-types';
import ScheduleRoom from '@/components/dashboard/schedule/ScheduleItem';
import TimeComponent from '@/components/dashboard/schedule/TimeComponent';
import { useSession } from 'next-auth/react';
import { getAllWorkshops, getMyWorkshops } from '@/app/api/workshops';

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
  const { data: session, status } = useSession();
  const roomColors = {
    1: '#65A5EB',
    2: '#7584F3',
    3: '#EE7379',
    4: '#9FD6A5',
    5: '#F5B354',
    6: '#056c43',
    7: '#1ccce8',
    9: '#b40b79'
  };
  const [assignedColors, setAssignedColor] = useState();

  const [userEvents, setUserEvents] = useState<WorkshopAttendeeListItem[]>();
  const [allEvents, setAllEvents] = useState();
  const [loading, setLoading] = useState<boolean>(false);
  // const { data: session, status } = useSession();
  let timeSlots = [];
  for (let i = 0; i < 12; i++) {
    timeSlots.push(i);
  }

  useEffect(() => {
    if (session?.access_token) {
      setLoading(true);
      getMyWorkshops(session.access_token, session.id_token)
        .then(data => {
          setUserEvents(data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [session]);

  useEffect(() => {
    if (session?.access_token) {
      setLoading(true);
      getAllWorkshops(session.access_token)
        .then(data => {
          setAllEvents(data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [session]);

  return (
    <div>
      {userEvents?.length}
      <div className="flex flex-col gap-2 w-full">
        <div className="bg-white border-2 border-gray-200 flex flex-col gap-2 w-fill p-2 rounded-lg">
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
                      <TimeComponent time={slot} location={'o'} />
                    ))}

                    {allEvents?.filter((workshop: ScheduleRoomProps) =>
                          userEvents?.some(
                            (userEvent: WorkshopAttendeeListItem) =>
                              userEvent.workshop === workshop.id
                          )
                      ).map((data: ScheduleRoomProps) => (
                        <ScheduleRoom
                          color={roomColors[1] || 'defaultColor'}
                          location={data.location || 'Room'}
                          duration={data.duration || 2}
                          workshopName={data.workshopName || 'defaultWorkshopName'}
                          description={data.description || 'defaultDescription'}
                          datetime={data.datetime || '2024-01-13T02:09:00.806940Z'}
                          skills={data.skills || []}
                          key={data.id}
                          id={data.id}
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
          <div className="text-zinc-500 text-2xl font-normal font-['Inter'] leading-normal bg-white border-2 border-gray-200 flex flex-col gap-2 w-fit p-2 rounded-lg bg-neutral-50 rounded-[10px] shadow">
            Location Key
            {Object.entries(roomColors).map(([roomId, color]) => (
              <LegendRoom color={color} name={`Room ${roomId}`} key={roomId} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
