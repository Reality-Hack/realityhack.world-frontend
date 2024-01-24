'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState, MouseEvent } from 'react';
import {
  getAllWorkshops,
  getMyWorkshops,
  showInterestInWorkshop
} from '@/app/api/workshops';
import { useAuthContext } from '@/hooks/AuthContext';

interface Workshop {
  workshop: any;
  id: number;
  room: string;
  selected: boolean;
  startTime: string;
  endTime: string;
  workshopTitle: string;
  major: string;
  level: string;
  workshopGiver: string;
  workshopDescription: string;
  roomLocation?: string;
  title?: string;
  curriculum: number;
  datetime: Date;
}

interface WorkshopProps extends Workshop {
  workshop: any;
  title?: string;
  roomLocation?: string;
  curriculum: number;
  speakers?: string;
  description?: string;
  myWorkshops?: any;
  onSelect: (id: number) => void;
}

type WorkshopKeywords = Record<
  string,
  { name: string; category: string; bg_color: string }
>;

const keywords: WorkshopKeywords = {
  1: { name: 'Developer', category: 'Beginner', bg_color: '#59BC74' },
  2: { name: 'Developer', category: 'Advanced', bg_color: '#FFA20D' },
  3: { name: 'Developer', category: 'New Tech', bg_color: '#623330' },
  4: { name: 'Designer', category: 'Beginner', bg_color: '#274566' },
  5: { name: 'Designer', category: 'Advanced', bg_color: '#3F2D60' },
  6: { name: 'Hardware', category: 'Hardware', bg_color: '#7E6338' }
};

function Workshop({
  workshop,
  id,
  selected,
  level,
  onSelect,
  title,
  roomLocation,
  curriculum,
  speakers,
  description,
  myWorkshops
}: WorkshopProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuthContext();

  const handleSeeMoreClick = (e: MouseEvent) => {
    e.stopPropagation();
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    showInterestInWorkshop(user.id, workshop.id);
    try {
      const promises: Promise<any>[] = []; // Declare the promises variable
      const results = await Promise.all(promises);
      console.log('Results:', results);
    } catch (error) {
      console.error('Error submitting workshops:', error);
    }
  };

  const isEnrolled = myWorkshops?.some(
    (myWorkshop: any) => myWorkshop.workshop === workshop.id
  );

  console.log('isEnrolled: ', isEnrolled);

  return (
    <div
      className={`bg-white ${
        isEnrolled ? 'border-green-300 border-2' : 'border-blue-300 border'
      } w-64 p-2 rounded-xl flex flex-col gap-2 shadow-md`}
      onClick={() => onSelect(id)}
    >
      <div>
        <div className="text-base font-medium ">{title}</div>
        <div className="text-sm text-gray-700">
          {roomLocation} | {formatTime(workshop?.datetime)} -{' '}
          {addHoursToTime(formatTime(workshop?.datetime), 1)}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap">
          <div
            className={`text-blue-700 text-xs px-3 py-0.5 mr-2 mb-2 rounded-md border border-blue-700`}
          >
            {keywords[curriculum]?.name || 'Unknown Curriculum'}
          </div>
        </div>
        <div className="flex flex-wrap">
          <div
            className={`text-xs px-3 py-0.5 mr-2 mb-2 rounded-md bg-slate-300`}
          >
            {workshop.speakers}
          </div>
        </div>
        <div className="flex">
          <div
            className="mx-auto mt-4 bg-[#4D97E8] px-4 py-[6px] rounded-full text-xs text-white cursor-pointer"
            onClick={handleSubmit}
          >
            Add to Schedule
          </div>
          <div
            className="mx-auto mt-4 bg-[#4D97E8] px-4 py-[6px] rounded-full text-xs text-white cursor-pointer"
            onClick={handleSeeMoreClick}
          >
            See More
          </div>
        </div>
        {dialogOpen && (
          <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)}>
            <div className="title-container mb-0.5">
              <div className="text-2xl font-bold text-black title">{title}</div>
            </div>
            <div className="mb-1 text-sm text-gray-700">
              By {speakers} | {formatTime(workshop?.datetime)} -{' '}
              {addHoursToTime(formatTime(workshop?.datetime), 1)} | Jan 25, 2024
            </div>
            <div className="flex flex-wrap mt-2 mb-1">
              <div
                style={{
                  backgroundColor: keywords[curriculum]
                    ? keywords[curriculum].bg_color
                    : '#000000'
                }}
                className={`text-white text-xs px-3 py-0.5 mr-2 mb-2 rounded-md`}
              >
                {keywords[curriculum]?.name || 'Unknown Curriculum'}
              </div>
              <div
                style={{
                  backgroundColor: keywords[level]
                    ? keywords[level].bg_color
                    : '#000000'
                }}
                className={`text-white text-xs px-3 py-0.5 mr-2 mb-2 rounded-md`}
              >
                {keywords[curriculum]?.category || 'Unknown Room'}
              </div>
            </div>
            <div className="p-4 text-black description-container">
              <div className="">{description}</div>
            </div>
            <div
              className="mx-auto mt-4 bg-[#4D97E8] px-7 py-[6px] w-fit rounded-full text-white cursor-pointer"
              onClick={handleSubmit}
            >
              Add to Schedule
            </div>
          </Dialog>
        )}
      </div>
    </div>
  );
}

interface SelectedWorkshopsProps {
  selectedWorkshops: any;
}

function SelectedWorkshops({ selectedWorkshops }: SelectedWorkshopsProps) {
  // const handleSubmit = async () => {
  //   const promises = selectedWorkshops.map((workshop: any) =>
  //     showInterestInWorkshop(user.id, workshop.id)
  //   );

  //   try {
  //     const results = await Promise.all(promises);
  //     console.log('Results:', results);
  //   } catch (error) {
  //     console.error('Error submitting workshops:', error);
  //   }
  // };

  return (
    <div className="pl-5">
      <h2>Selected Workshops:</h2>
      <div className="flex items-center gap-4">
        <ul className="h-16 px-4 py-2 overflow-scroll bg-gray-100 rounded w-[500px]">
          {selectedWorkshops.map((workshop: any, index: number) => (
            <li key={index}>{workshop.name.split(/-(.+)/)[1]?.trim()}</li>
          ))}
        </ul>
        {selectedWorkshops.length ? (
          <button
            // onClick={handleSubmit}
            className="gap-1.5s flex mt-0 mb-4 bg-[#1677FF] text-white px-4 py-[6px] rounded-md shadow my-4 font-light text-sm hover:bg-[#0066F5] transition-all"
          >
            Submit
          </button>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

interface WorkshopRoomProps {
  room?: string;
  workshops?: Workshop[];
  workshop?: any;
  myWorkshops?: any;
  onSelect: (id: number) => void;
  curriculum?: number;
}

const WorkshopRoom: React.FC<WorkshopRoomProps> = ({
  room,
  workshops,
  workshop,
  onSelect,
  curriculum,
  myWorkshops
}) => {
  const roomNames = [
    'Curr. 1 - Beginner Dev',
    'Curr. 2 - Advanced Dev',
    'Curr. 3 - New Tech Dev',
    'Curr. 4 - Beginner Designer',
    'Curr. 5 - Advanced Designer',
    'Curr. 6 - Hardware'
  ];

  const roomColors = [
    '#A2E1A5',
    '#E26677',
    '#777CE4',
    '#EFB45A',
    '#6DA9E5',
    '#CA0C6C'
  ];

  const bgColor = roomColors[Number(room) - 1] || '#000000';

  const sortedWorkshops = workshops
    ? workshops.sort(
        (a, b) =>
          new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
      )
    : [];

  return (
    <div>
      <div
        style={{
          backgroundColor: bgColor
        }}
        className="text-white text-base px-3 py-0.5 mr-2 mb-2 rounded-md"
      >
        {roomNames[Number(room) - 1]}
      </div>
      <div className="flex flex-col gap-2">
        {workshops &&
          workshops.map(workshop => (
            <Workshop
              key={workshop.id}
              {...workshop}
              workshop={workshop}
              onSelect={onSelect}
              myWorkshops={myWorkshops}
            />
          ))}
      </div>
    </div>
  );
};

interface PageProps {}

const Page: React.FC<PageProps> = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [myWorkshops, setMyWorkshops] = useState<any>(null);
  const [selectedWorkshops, setSelectedWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();
  const isAdmin = session && session.roles?.includes('admin');
  const { user } = useAuthContext();

  const parseWorkshopName = (name: string) => {
    const [firstPart, ...titleParts] = name.split(' - ');
    const parts = firstPart.split('-');
    const roomLocation = parts.slice(1).join('-');
    const title = titleParts.join(' - ');
    const curriculum = parseInt(parts[0].substring(1));

    return { roomLocation, title, curriculum };
  };

  function splitDescription(input: string) {
    const [speakersPart, description] = input.split(' - ');

    const speakers = speakersPart.split(',').map(speaker => speaker.trim());

    return { speakers, description };
  }

  useEffect(() => {
    if (session?.access_token && isAdmin) {
      setLoading(true);
      getAllWorkshops(session.access_token)
        .then(data => {
          const workshopsWithAdditionalInfo = data.map((workshop: any) => {
            const { roomLocation, title, curriculum } = parseWorkshopName(
              workshop.name
            );
            const { speakers, description } = splitDescription(
              workshop.description
            );
            return {
              ...workshop,
              roomLocation,
              title,
              curriculum,
              speakers,
              description
            };
          });
          setWorkshops(workshopsWithAdditionalInfo);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [session]);

  useEffect(() => {
    if (session?.access_token && user) {
      setLoading(true);
      getMyWorkshops(session.access_token, user.id)
        .then(data => {
          setMyWorkshops(data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [session]);

  useEffect(() => {
    const selected = workshops.filter(workshop => workshop.selected);
    setSelectedWorkshops(selected);
  }, [workshops]);

  const handleWorkshopSelect = (id: number) => {
    setWorkshops(prevWorkshops =>
      prevWorkshops.map(workshop =>
        workshop.id === id
          ? { ...workshop, selected: !workshop.selected }
          : workshop
      )
    );
  };

  const workshopsByRoom: Record<string, Workshop[]> = workshops.reduce(
    (acc: Record<string, Workshop[]>, workshop) => {
      const room = workshop.curriculum;
      acc[room] = acc[room] || [];
      acc[room].push(workshop);
      return acc;
    },
    {}
  );

  return (
    <div className="w-screen h-screen bg-white">
      <div className="flex flex-col">
        {/* <SelectedWorkshops selectedWorkshops={selectedWorkshops} /> */}
        <div className="flex gap-2 p-4">
          {Object.entries(workshopsByRoom).map(
            ([room, roomWorkshops]: [string, Workshop[]]) => (
              <WorkshopRoom
                key={room}
                room={room}
                workshops={roomWorkshops}
                myWorkshops={myWorkshops}
                onSelect={handleWorkshopSelect}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  const handleDialogClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close the dialog only if the click is outside the inner dialog content
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      onClose();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center z-[1002]"
        onClick={handleDialogClick}
      >
        <div className="relative w-1/2 p-4 bg-white rounded-md shadow-md h-1/2">
          <div className="flex">
            <button className="ml-auto " onClick={onClose}>
              Close
            </button>
          </div>
          <div>{children}</div>
        </div>
      </div>
      <div className="fixed inset-0 bg-black/30 z-[1001]" aria-hidden="true" />
    </>
  );
};

export default Page;

function formatTime(datetimeString: string): string {
  const timeWithMilliseconds: string = datetimeString.split('T')[1]; // "02:09:56.806940Z"
  const timePart: string = timeWithMilliseconds.split('.')[0]; // "02:09:56"

  const [hours, minutes]: number[] = timePart.split(':').map(Number);
  const ampm: string = hours >= 12 ? 'PM' : 'AM';

  // Ensure minutes are represented as two digits
  const formattedMinutes: string = String(minutes).padStart(2, '0');

  const formattedTime: string = `${
    hours % 12 || 12
  }:${formattedMinutes} ${ampm}`;

  return formattedTime;
}

function addHoursToTime(time: string, hoursToAdd: number) {
  // Extract hour, minute, and AM/PM information from the time string
  const match = time.match(/(\d+):(\d+)\s*([apAP][mM])?/);

  if (!match) {
    // Handle invalid time format
    throw new Error('Invalid time format');
  }

  const [, hourStr, minuteStr, ampm] = match;
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const isPM = ampm && ampm.toLowerCase() === 'pm';

  // Convert time to 24-hour format
  let totalHours = hour + (isPM && hour !== 12 ? 12 : 0);

  // Add hours
  totalHours += hoursToAdd;

  // Calculate new hour and AMPM
  const newHour = totalHours % 12 || 12;
  const newAMPM = totalHours >= 12 ? 'PM' : 'AM';

  // Format the result
  const formattedTime = `${newHour}:${minute
    .toString()
    .padStart(2, '0')} ${newAMPM}`;

  return formattedTime;
}
