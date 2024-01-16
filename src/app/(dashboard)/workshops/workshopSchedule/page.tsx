'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState, MouseEvent } from 'react';
import { getAllWorkshops } from '@/app/api/workshops';

interface Workshop {
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
}
interface WorkshopPropsss {
  id: string;
  recommended_for: string[];
  name: string;
  datetime: string;
  duration: number;
  description: string;
  course_materials: string;
  created_at: string;
  updated_at: string;
  location: string;
  skills: string[];
  hardware: string[];
}

interface WorkshopProps extends Workshop {
  onSelect: (id: number) => void;
}

type WorkshopKeywords = Record<string, { category: string; bg_color: string }>;
const keywords: WorkshopKeywords  = {
  'Beginner' : { category: 'level', bg_color: '#59BC74' },
  'Intermediate': { category: 'level', bg_color: '#FFA20D' },
  'Advanced': { category: 'level', bg_color: '#623330' },
  'Developer': { category: 'major', bg_color: '#274566' },
  'Designer': { category: 'major', bg_color: '#3F2D60' },
  'Business': { category: 'major', bg_color: '#573B32' },
  'Hardware Hack': { category: 'major', bg_color: '#7E6338' },
};

function Workshop({
  id,
  selected,
  startTime,
  endTime,
  workshopTitle,
  major,
  level,
  workshopGiver,
  workshopDescription,
  onSelect
}: WorkshopProps) 
{
  const { data: session, status } = useSession();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSeeMoreClick = (e: MouseEvent) => {
    e.stopPropagation();
    setDialogOpen(true);
  };

  const isAdmin = session && session.roles?.includes('admin');
  const [loading, setLoading] = useState<boolean>(false);
  const [workshops, setWorkshops] = useState<WorkshopPropsss[]>([]);

  useEffect(() => {
    if (session?.access_token && isAdmin) {
      setLoading(true);
      getAllWorkshops(session.access_token)
        .then(data => {
          setWorkshops(data)

        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [session]);

  return (
    <div
    className={`bg-white ${
      selected ? "border-green-300 border-4" : "border-blue-300 border-2"
    } w-64 p-2 rounded-xl flex flex-col gap-2 shadow-md`}
    onClick={() => onSelect(id)}
  >
    <div>
      <div className="font-medium text-base ">{workshopTitle}</div>
      <div className="text-gray-700 text-sm">
        {startTime} - {endTime} | Jan 25, 2024
      </div>
    </div>
    <div className="flex flex-col gap-2">
    <div className="flex flex-wrap">
        <div style={{
            backgroundColor: keywords[major] ? keywords[major].bg_color : '#000000'
          }} className={`text-white text-xs px-3 py-0.5 mr-2 mb-2 rounded-md`} >
            {major}
        </div>
        <div style={{
            backgroundColor: keywords[level] ? keywords[level].bg_color : '#000000'
          }} className={`text-white text-xs px-3 py-0.5 mr-2 mb-2 rounded-md`} >
            {level}
        </div>
    </div>
    <div className="flex flex-wrap">
      <div className={`text-xs px-3 py-0.5 mr-2 mb-2 rounded-md bg-slate-300`} >
          {workshopGiver}
        </div>
    </div>
    <div
      className="text-xs px-2 text-blue-400 ml-auto border-2 border-gray-400 hover:bg-blue-200 hover:text-white border-0 hover:cursor-pointer p-1 rounded-lg"
      onClick={handleSeeMoreClick}
    >
      See More
    </div>
      {dialogOpen && (
       <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)}>
        <div className="title-container mb-0.5">
          <div className="title text-2xl font-bold text-black">{workshopTitle}</div>
        </div>
        <div className="text-gray-700 text-sm mb-1">
          By {workshopGiver} | {startTime} - {endTime} | Jan 25, 2024
        </div>
        <div className="flex flex-wrap mb-1">
          <div style={{
            backgroundColor: keywords[major] ? keywords[major].bg_color : '#000000'
          }} className={`text-white text-xs px-3 py-0.5 mr-2 mb-2 rounded-md`} >
            {major}
          </div>
          <div style={{
            backgroundColor: keywords[level] ? keywords[level].bg_color : '#000000'
          }} className={`text-white text-xs px-3 py-0.5 mr-2 mb-2 rounded-md`} >
            {level}
          </div>
      </div>
      <div className="description-container text-black p-4">
        <div className="description">{workshopDescription}</div>
      </div>
     </Dialog>
      )}
    </div>
  </div>
);
}

interface SelectedWorkshopsProps {
  selectedWorkshops: Workshop[];
}

function SelectedWorkshops({ selectedWorkshops }: SelectedWorkshopsProps) {
  return (
    <div>
      <h2>Selected Workshops</h2>
      <ul>
        {selectedWorkshops.map((workshop, index) => (
          <li key={index}>
            Index: {index}, ID: {workshop.id}, Imaginary Event:{' '}
            {workshop.workshopTitle}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface WorkshopRoomProps {
  room: string;
  workshops: Workshop[];
  onSelect: (id: number) => void;
}

const WorkshopRoom: React.FC<WorkshopRoomProps> = ({ room, workshops, onSelect }) => {
  const roomColors: { [key: string]: string } = {
    "iHQ 3F | Southern Air Temple": '#A2E1A5', 
    "iHQ 4F | Western Air Temple": '#E26677', 
    "iHQ 7F | Northern Air Temple": '#777CE4', 
    "iHQ 6F | Turtle Island": '#EFB45A', 
    "iHQ 6F | Water Tribe": '#6DA9E5', 
    "Old ML| Ember Island": '#CA0C6C', 
  };

  const bgColor = roomColors[room] || '#000000'; 

  return (
    <div>
      <div
        style={{
          backgroundColor: bgColor,
        }}
        className="text-white text-base px-3 py-0.5 mr-2 mb-2 rounded-md"
      >
        {room}          
      </div>
      <div className="flex flex-col gap-2">
        {workshops.map((workshop) => (
          <Workshop key={workshop.id} {...workshop} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
};



interface PageProps {}

const Page: React.FC<PageProps> = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([
    {
      id: 1,
      workshopTitle: 'React Workshop',
      startTime: '10:00 AM',
      endTime: '1:00 PM',
      major: 'Developer',
      level: 'Beginner',
      workshopGiver: 'React Expert',
      workshopDescription: 'Learn the basics of React.',
      selected: false,
      room: "iHQ 3F | Southern Air Temple",
    },
    {
      id: 2,
      workshopTitle: 'Node.js Masterclass',
      startTime: '2:00 PM',
      endTime: '5:00 PM',
      major: 'Designer',
      level: 'Advanced',
      workshopGiver: 'Node.js Guru',
      workshopDescription: 'Deep dive into Node.js.',
      selected: false,
      room: "iHQ 4F | Western Air Temple",
    },
    {
      id: 3,
      workshopTitle: 'CSS Styling Secrets',
      startTime: '3:00 PM',
      endTime: '6:00 PM',
      major: 'Designer',
      level: 'Intermediate',
      workshopGiver: 'CSS Wizard',
      workshopDescription: 'Unlock the secrets of CSS styling.',
      selected: false,
      room: "iHQ 7F | Northern Air Temple",
    },
    {
      id: 4,
      workshopTitle: 'CSS Styling Secrets',
      startTime: '3:00 PM',
      endTime: '6:00 PM',
      major: 'Designer',
      level: 'Intermediate',
      workshopGiver: 'CSS Wizard',
      workshopDescription: 'Unlock the secrets of CSS styling.',
      selected: false,
      room: "iHQ 3F | Southern Air Temple",
    }
  ]);

  const [selectedWorkshops, setSelectedWorkshops] = useState<Workshop[]>([]);

  const handleWorkshopSelect = (id: number) => {
    setWorkshops(prevWorkshops =>
      prevWorkshops.map(workshop =>
        workshop.id === id
          ? { ...workshop, selected: !workshop.selected }
          : workshop
      )
    );

    setSelectedWorkshops(workshops.filter(workshop => workshop.selected));
  };

  const workshopsByRoom: Record<string, Workshop[]> = workshops.reduce(
    (acc: Record<string, Workshop[]>, workshop) => {
      acc[workshop.room] = acc[workshop.room] || [];
      acc[workshop.room].push(workshop);
      return acc;
    },
    {}
  );

  return (
    <div className="h-screen w-screen bg-white">
      <div className="flex gap-2">
        {Object.entries(workshopsByRoom).map(
          ([room, roomWorkshops]: [string, Workshop[]]) => (
            <WorkshopRoom
              key={room}
              room={room}
              workshops={roomWorkshops}
              onSelect={handleWorkshopSelect}
            />
          )
        )}
        <SelectedWorkshops selectedWorkshops={selectedWorkshops} />
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
    <div
      className="fixed inset-0 flex items-center justify-center"
      onClick={handleDialogClick}
    >
      <div className="bg-gray-300 w-1/2 h-1/2 p-4 rounded-md shadow-md">
        <div className="flex">
          <button className=" ml-auto" onClick={onClose}>
            Close
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Page;
