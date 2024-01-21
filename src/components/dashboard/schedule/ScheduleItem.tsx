'use client';
import React, { useState, useEffect } from 'react';
import {
  ScheduleRoomProps,
  DialogProps,
  ExperienceLevel
} from '@/types/schedule-types';

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
      className="fixed inset-0 z-10 flex items-center justify-center"
      onClick={handleDialogClick}
    >
      <div className="w-1/2 p-4 bg-white rounded-md shadow-md h-1/2">
        <div className="flex">
          <button className="ml-auto" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const ScheduleRoom: React.FC<ScheduleRoomProps> = ({
  datetime,
  location,
  duration,
  workshopName,
  color,
  description,
  skills,
  id,
  recommended_for
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [floorNumber, setFloorNumber] = useState<number>(0);
  const [randomColor, setRandomColor] = useState<string>('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const roomColors: { [key: string]: string } = {
    1: '#65A5EB',
    2: '#7584F3',
    3: '#EE7379',
    4: '#9FD6A5',
    5: '#F5B354',
    6: '#056c43',
    7: '#1ccce8',
    9: '#b40b79'
  };

  useEffect(() => {
    let [timeConv, period] = formatTime(datetime).split(/(am|pm)/i);
    let startHour = parseInt(timeConv);
    if (period.toLowerCase() === 'pm' && startHour !== 12) {
      startHour += 6;
    } else if (period === 'am') {
      startHour -= 7;
    }
    setStartTime(startHour);
    //set the time and color of the schedule box
    let floorLocation = location.split(/(\d+)/);
    setStartTime(2);
    setFloorNumber(parseInt(floorLocation[1]));
    const colorKeys = Object.keys(roomColors);
    const randomKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
    setRandomColor(roomColors[randomKey]);
  }, []);

  const handleSeeMoreClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDialogOpen(true);
  };

  const getMappedTimeFormat = (hour: any) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;

    hour = (hour + 3) % 12 || 12;

    return `${hour} ${ampm}`;
  };

  return (
    <div
      onClick={handleSeeMoreClick}
      style={{
        backgroundColor: color,
        gridColumnStart: getMappedTimeFormat(
          new Date(datetime).getUTCHours()
        ).split(' ')[0],
        gridRowStart: 3,
        gridColumnEnd: `span ${duration / 10}`,
        width: '208px'
      }}
      className={`h-11 rounded-[10px] shadow p-1 hover:cursor-pointer`}
    >
      <div>
        <div className="text-white text-base font-medium font-['Inter'] overflow-x-hidden">
          <div className="w-[146px] text-indigo-200 text-[10px] font-medium font-['Inter'] leading-[10px] ml-2 whitespace-nowrap">
            <div
              style={{
                fontSize: '10px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {location.slice(0, 5)} | {formatTime(datetime)} -{' '}
              {addHoursToTime(formatTime(datetime), 1)}
            </div>
          </div>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <p className="ml-2 text-sm">{workshopName}</p>
          </div>
        </div>
      </div>
      {dialogOpen && (
        <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)}>
          <div className="flex flex-col items-center flex-shrink-0 h-full gap-8 overflow-y-auto w-96">
            <div className="flex flex-col items-center gap-2">
              <p className="text-blue-400 text-3xl font-medium font-['Inter'] ">
                {workshopName}
              </p>
              <div>
                {location.slice(0, 5)} | {formatTime(datetime)} -{' '}
                {addHoursToTime(formatTime(datetime), 1)}
              </div>
            </div>
            <div className="overflow-hidden overflow-ellipsis">
              <div className="flex-grow break-words whitespace-normal">
                {description}
              </div>
            </div>{' '}
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-row gap-2">
                {recommended_for.map(attendeeType => (
                  <div className="p-1 bg-blue-200 rounded-lg w-fit">
                    {(ExperienceLevel as Record<string, string>)[attendeeType]}
                  </div>
                ))}
              </div>
              <div className="p-1 bg-gray-200 rounded-lg w-fit">
                Sponsor Led
              </div>
            </div>
            <div className="p-1 mt-auto mb-8 text-white bg-purple-900 rounded-2xl">
              Add to My Schedule
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default ScheduleRoom;

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
