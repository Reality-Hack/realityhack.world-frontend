'use client';
import React, { useState, useEffect } from 'react';
import {
  LegendRoomProps,
  Workshop,
  WorkshopAttendeeListItem
} from '@/types/schedule-types';
import ScheduleRoom from '@/components/dashboard/schedule/ScheduleItem';
import TimeComponent from '@/components/dashboard/schedule/TimeComponent';
import { useSession } from 'next-auth/react';
import { getAllWorkshops, getMyWorkshops } from '@/app/api/workshops';
import { useAuthContext } from '@/hooks/AuthContext';

const LegendRoom: React.FC<LegendRoomProps> = ({ color, name }) => {
  const roomNames: { [key: string]: string } = {
    '1': 'Curr. 1 - Beginner Dev',
    '2': 'Curr. 2 - Advanced Dev',
    '3': 'Curr. 3 - New Tech Dev',
    '4': 'Curr. 4 - Beginner Designer',
    '5': 'Curr. 5 - Advanced Designer',
    '6': 'Curr. 6 - Hardware',
    '7': 'Curr. 7 - Business'
  };

  return (
    <div className="flex flex-row content-center gap-2 ml-2">
      <div
        style={{ backgroundColor: color }}
        className={`h-4 w-4 rounded`}
      ></div>
      <div>{roomNames[name]}</div>
    </div>
  );
};

const Page: React.FC = () => {
  const { data: session } = useSession();

  const roomColors = {
    1: '#A2E1A5',
    2: '#E26677',
    3: '#777CE4',
    4: '#EFB45A',
    5: '#CA0C6C',
    6: '#CA0C6C',
    7: '#0da38f'
  };

  const [userEvents, setUserEvents] = useState<WorkshopAttendeeListItem[]>();
  const [allEvents, setAllEvents] = useState<[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useAuthContext();

  const START_HOUR = 10;
  const END_HOUR = 17;

  let timeSlots = [];
  for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
    const isPM = hour >= 12;
    const formattedHour = hour > 12 ? hour - 12 : hour;
    const amPmSuffix = isPM ? 'PM' : 'AM';

    timeSlots.push(`${formattedHour} ${amPmSuffix}`);
  }

  useEffect(() => {
    if (session?.access_token && user) {
      setLoading(true);
      getMyWorkshops(session.access_token, user.id)
        .then(data => {
          setUserEvents(data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [session, allEvents]);

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
      {userEvents?.length ? (
        <div className="pb-2">Scheduled Workshops: {userEvents?.length}</div>
      ) : (
        <div className="pb-2">No Scheduled Workshops</div>
      )}
      <div className="flex flex-col w-full gap-2">
        <div className="flex flex-col gap-2 p-2 bg-white border-2 border-gray-200 rounded-lg w-fill">
          <div>
            <div>
              <div className="w-[100%] bg-neutral-50 rounded-[10px] shadow overflow-x-scroll h-[576px]">
                <span className="mt-6 ml-3 text-2xl font-normal leading-normal text-zinc-500 ">
                  Schedule
                </span>
                <div className="p-4 rounded-[10px] min-w-[1000px] overflow-x-auto">
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(8, 208px)',
                      gridTemplateRows: 'repeat(6, 1fr)',
                      alignItems: 'start',
                      marginLeft: '16px'
                    }}
                    className="grid gap-4 grid-rows-9 grid-cols-14"
                  >
                    {timeSlots.map((slot: any) => (
                      <TimeComponent time={slot} location={'o'} />
                    ))}
                    {allEvents
                      ?.filter((workshop: Workshop) =>
                        userEvents?.some(
                          (userEvent: WorkshopAttendeeListItem) =>
                            userEvent.workshop === workshop.id
                        )
                      )
                      .map((data: Workshop) => {
                        const userEvent = userEvents?.find(
                          ue => ue.workshop === data.id
                        );

                        return (
                          <ScheduleRoom
                            color={roomColors[1] || 'defaultColor'}
                            location={data.location || 'Room'}
                            duration={data.duration || 2}
                            workshopName={data.name || 'defaultWorkshopName'}
                            description={
                              data.description || 'No Description provided.'
                            }
                            datetime={
                              data.datetime || '2026-01-25T02:09:00.806940Z'
                            }
                            skills={data.skills || []}
                            key={data.id}
                            id={userEvent ? userEvent.id : null}
                            recommended_for={data.recommended_for}
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
            <div className="origin-top-left -rotate-90 translate-y-[-500%] text-zinc-500 text-base font-light leading-normal tracking-[2.88px]">
              Saturday January 24
            </div>
          </div>
          <div className="text-zinc-500 text-2xl font-normal leading-normal bg-white border-2 border-gray-200 flex flex-col gap-2 w-fit p-2 rounded-lg bg-neutral-50 rounded-[10px] shadow">
            Legend
            {Object.entries(roomColors).map(([roomId, color]) => (
              <LegendRoom color={color} name={roomId} key={roomId} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
