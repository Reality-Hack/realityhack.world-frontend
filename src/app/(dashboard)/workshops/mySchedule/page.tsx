"use client"
import React, { useState } from "react";

interface Room {
  color: string;
  name: string;
}

interface LegendRoomProps {
  color: string;
  name: string;
}

interface ScheduleRoomProps {
  color: string;
  location: string;
  time: string;
  duration: number;
  workshopName: string;
  description: string;
}

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const LegendRoom: React.FC<LegendRoomProps> = ({ color, name }) => {
  return (
    <div className="flex flex-row gap-2">
      <div style={{ backgroundColor: color }} className={`h-8 w-8`}></div>
      <div>{name}</div>
    </div>
  );
};

const ScheduleRoom: React.FC<ScheduleRoomProps> = ({
  color,
  location,
  time,
  duration,
  workshopName,
  description,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSeeMoreClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDialogOpen(true);
  };

  return (
    <div
      onClick={handleSeeMoreClick}
      style={{ backgroundColor: color, gridColumnEnd: `span ${duration}` }}
      className="p-1 text-white"
    >
      <div className="flex flex-col">
        <div>
          {location} | {time}{" "}
        </div>
        <div>{workshopName}</div>
      </div>
      {dialogOpen && (
        <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)}>
          <div className="text-xl font-semibold mb-2">{workshopName}</div>
          <div>{description}</div>
        </Dialog>
      )}
    </div>
  );
};

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
          <button className="ml-auto" onClick={onClose}>
            Close
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

const Page: React.FC = () => {
	const rooms: Room[] = [
	  { color: "red", name: "Room 1" },
	  { color: "orange", name: "Room 2" },
	  { color: "green", name: "Room 3" },
	];
  
	return (
	  <div>
		<div className="flex flex-col gap-2 w-full">
		  <div className="bg-gray-200">
			<div className="text-3xl">Schedule Box</div>
			<div className="grid grid-cols-14 grid-rows-7 gap-4">
			  <div className="bg-blue-500 p-4">
				<div className="flex flex-row h-full text-white">
				  <div className="flex-1 day-column border-r border-dashed border-white">
					8am
				  </div>
				  <div className="flex-1 day-column border-r border-dashed border-white">
					9am
				  </div>
				  <div className="flex-1 day-column border-r border-dashed border-white">
					10am
				  </div>
				  <div className="flex-1 day-column border-r border-dashed border-white">
					11am
				  </div>
				  <div className="flex-1 day-column border-r border-dashed border-white">
					12pm
				  </div>
				  <div className="flex-1 day-column border-r border-dashed border-white">
					1pm
				  </div>
				  <div className="flex-1 day-column border-r border-dashed border-white">
					2pm
				  </div>
				  <div className="flex-1 day-column border-r border-dashed border-white">
					3pm
				  </div>
				  <div className="flex-1 day-column border-r border-dashed border-white">
					4pm
				  </div>
				  <div className="flex-1 day-column border-r border-dashed border-white">
					5pm
				  </div>
				  <div className="flex-1 day-column">6pm</div>
				</div>
			  </div>
			  <div className="p-4">
				<ScheduleRoom
				  duration={3}
				  color={"blue"}
				  location={"room 1"}
				  time="7am -10am"
				  workshopName="Awes0ke"
				  description="oiio"
				/>
			  </div>
			  <div className="p-4">3</div>
			  <div className="p-4">4</div>
			  <div className="p-4">5</div>
			  <div className="p-4">6</div>
			  <div className="p-4">7</div>
			</div>
		  </div>
		  <div className="bg-white border-2 border-gray-200 flex flex-col gap-2 w-fit p-2 rounded-lg">
			<div className="text-3xl">Location Key</div>
			{rooms.map((el) => (
			  <LegendRoom color={el.color} name={el.name} key={el.name} />
			))}
		  </div>
		</div>
	  </div>
	);
  };
  
  export default Page;
  

