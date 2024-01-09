"use client"
import React, { useState, MouseEvent } from "react";

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

interface WorkshopProps extends Workshop {
  onSelect: (id: number) => void;
}

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
  onSelect,
}: WorkshopProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSeeMoreClick = (e: MouseEvent) => {
    e.stopPropagation();
    setDialogOpen(true);
  };

  return (
    <div
      className={`bg-white ${
        selected ? "border-blue-300 border-4" : "border-black border-2"
      } w-fit p-2 rounded-xl flex flex-col gap-2`}
      onClick={() => onSelect(id)}
    >
      <div>
        <div className="font-semibold text-xl">{workshopTitle}</div>
        <div>
          {startTime} - {endTime} | Jan 25, 2024
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap">
          <div className="bg-black text-white px-1 rounded-md">{major}</div>
        </div>
        <div>
          <div className="bg-blue-800 text-white px-1 rounded-md w-fit">
            {level}
          </div>
        </div>
        <div>{workshopGiver}</div>
        <div
          className="text-blue-400 ml-auto border-2 border-gray-400 hover:bg-blue-200 hover:text-white border-0 hover:cursor-pointer p-1 rounded-lg"
          onClick={handleSeeMoreClick}
        >
          See More
        </div>
        {dialogOpen && (
          <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)}>
            <div className="text-xl font-semibold mb-2">{workshopTitle}</div>
            <div>{workshopDescription}</div>
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
            Index: {index}, ID: {workshop.id}, Imaginary Event:{" "}
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

const WorkshopRoom: React.FC<WorkshopRoomProps> = ({
  room,
  workshops,
  onSelect,
}) => {
  return (
    <div>
      <div className="text-4xl">{room}</div>
      <div className="flex flex-col gap-2">
        {workshops.map((workshop) => (
          <Workshop
            key={workshop.id}
            {...workshop}
            onSelect={onSelect}
          />
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
      workshopTitle: "React Workshop",
      startTime: "10:00 AM",
      endTime: "1:00 PM",
      major: "Developer",
      level: "Beginner",
      workshopGiver: "React Expert",
      workshopDescription: "Learn the basics of React.",
      selected: false,
      room: "Room A",
    },
    {
      id: 2,
      workshopTitle: "Node.js Masterclass",
      startTime: "2:00 PM",
      endTime: "5:00 PM",
      major: "Designer",
      level: "Advanced",
      workshopGiver: "Node.js Guru",
      workshopDescription: "Deep dive into Node.js.",
      selected: false,
      room: "Room B",
    },
    {
      id: 3,
      workshopTitle: "CSS Styling Secrets",
      startTime: "3:00 PM",
      endTime: "6:00 PM",
      major: "Designer",
      level: "Intermediate",
      workshopGiver: "CSS Wizard",
      workshopDescription: "Unlock the secrets of CSS styling.",
      selected: false,
      room: "Room A",
    },
    {
      id: 4,
      workshopTitle: "CSS Styling Secrets",
      startTime: "3:00 PM",
      endTime: "6:00 PM",
      major: "Designer",
      level: "Intermediate",
      workshopGiver: "CSS Wizard",
      workshopDescription: "Unlock the secrets of CSS styling.",
      selected: false,
      room: "Room C",
    },
  ]);

  const [selectedWorkshops, setSelectedWorkshops] = useState<Workshop[]>([]);

  const handleWorkshopSelect = (id: number) => {
    setWorkshops((prevWorkshops) =>
      prevWorkshops.map((workshop) =>
        workshop.id === id ? { ...workshop, selected: !workshop.selected } : workshop
      )
    );

    setSelectedWorkshops(workshops.filter((workshop) => workshop.selected));
  };

  const workshopsByRoom: Record<string, Workshop[]> = workshops.reduce((acc: Record<string, Workshop[]>, workshop) => {
	acc[workshop.room] = acc[workshop.room] || [];
	acc[workshop.room].push(workshop);
	return acc;
  }, {});

  return (
    <div className="h-screen w-screen bg-white">
      <div className="flex gap-2">
        {Object.entries(workshopsByRoom).map(([room, roomWorkshops]: [string, Workshop[]]) => (
          <WorkshopRoom key={room} room={room} workshops={roomWorkshops} onSelect={handleWorkshopSelect} />
        ))}
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
    <div className="fixed inset-0 flex items-center justify-center" onClick={handleDialogClick}>
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
