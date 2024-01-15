'use client';
import React, { useState, useEffect } from 'react';
import { ScheduleRoomProps, DialogProps } from '@/types/schedule-types';

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

const ScheduleRoom: React.FC<ScheduleRoomProps> = ({
  time,
  location,
  duration,
  workshopName,
  color,
  description
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [floorNumber, setFloorNumber] = useState<number>(0);

  useEffect(() => {
    let [timeConv, period] = time.split(/(am|pm)/i);
    let floorLocation = location.split(/(\d+)/);
    let startHour = parseInt(timeConv);
    if (period === 'pm' && startHour!==12) {
      startHour += 5;
    } else if(period === 'am'){
      startHour -= 7;
    }
    setStartTime(startHour);
    setFloorNumber(parseInt(floorLocation[1]));
  }, [time, location]);

  const handleSeeMoreClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDialogOpen(true);
  };

  return (
    <div
      onClick={handleSeeMoreClick}
      style={{
        backgroundColor: color,
        gridColumnStart: startTime,
        gridColumnEnd: `span ${duration}`,
        gridRowStart: floorNumber + 1
      }}
      className={`h-11 rounded-[10px] shadow`}
    >
      <div>
        <div className="text-indigo-200 text-[10px] font-medium font-['Inter'] leading-[10px] ml-2 whitespace-nowrap">
          {location} - {time}
        </div>
        <div className="max-h-[25px] overflow-x-scroll">{workshopName}</div>
      </div>
      {dialogOpen && (
        <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)}>
          <div className="text-white text-base font-medium font-['Inter']">
            {workshopName}
          </div>
          <div>{description}</div>
        </Dialog>
      )}
    </div>
  );
};

export default ScheduleRoom;
