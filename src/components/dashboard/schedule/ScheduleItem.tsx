'use client';
import React, { useState, useEffect } from 'react';
import {
  ScheduleRoomProps,
  DialogProps,
  ExperienceLevel
} from '@/types/schedule-types';
import { removeInterestInWorkshop } from '@/app/api/workshops';

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
        <div className="relative w-1/2 p-4 bg-white rounded-md shadow-md">
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
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const roomColors: { [key: string]: string } = {
    1: '#7584F3',
    2: '#EE7379',
    3: '#9FD6A5',
    4: '#F5B354',
    5: '#65A5EB',
    6: '#D6266E',
    7: '#0da38f'
  };

  const parseWorkshopName = (name: string) => {
    const [firstPart, ...titleParts] = name.split(' - ');
    const parts = firstPart.split('-');
    const roomLocation = parts.slice(1).join('-');
    const title = titleParts.join(' - ');
    const curriculum = parseInt(parts[0].substring(1));

    return { roomLocation, title, curriculum };
  };

  const { roomLocation, title, curriculum } = parseWorkshopName(workshopName);

  useEffect(() => {
    let [timeConv, period] = formatTime(datetime).split(/(am|pm)/i);
    let startHour = parseInt(timeConv);
    if (period.toLowerCase() === 'pm' && startHour !== 12) {
      startHour += 6;
    } else if (period === 'am') {
      startHour -= 7;
    }
    setStartTime(startHour);
    let floorLocation = location.split(/(\d+)/);
    setStartTime(2);
    setFloorNumber(parseInt(floorLocation[1]));
    const colorKeys = Object.keys(roomColors);
    const randomKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
    setRandomColor(roomColors[randomKey]);
  }, [loading]);

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

  const handleSubmit = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      if (id) {
        await removeInterestInWorkshop(id);
      }
    } catch (error) {
      console.error('Error in handling workshop interest:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleSeeMoreClick}
      style={{
        backgroundColor: roomColors[curriculum],
        gridColumnStart: getMappedTimeFormat(
          new Date(datetime).getUTCHours()
        ).split(' ')[0],
        gridRowStart: curriculum + 1,
        gridColumnEnd: `span ${duration / 10}`,
        width: '208px',
        height: '64px',
        paddingLeft: '8px',
        paddingRight: '16px'
      }}
      className={`h-11 rounded-[10px] shadow p-1 hover:cursor-pointer`}
    >
      <div>
        <div className="text-white text-base font-medium font-['Inter'] overflow-x-hidden">
          <div className="w-[146px] text-white opacity-60 text-[10px] font-medium font-['Inter'] leading-[10px] whitespace-nowrap">
            <div
              style={{
                fontSize: '10px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {roomLocation} | {formatTime(datetime)} -{' '}
              {addHoursToTime(formatTime(datetime), 1)}
            </div>
          </div>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span className="text-sm">{title}</span>
          </div>
        </div>
      </div>
      {dialogOpen && (
        <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)}>
          <div className="flex flex-col items-center flex-shrink-0 w-full h-full gap-8 overflow-y-auto">
            <div className="flex flex-col items-center gap-2">
              <p className="text-black text-3xl font-medium font-['Inter'] ">
                {title}
              </p>
              <div className="text-black opacity-60">
                {roomLocation} | {formatTime(datetime)} -{' '}
                {addHoursToTime(formatTime(datetime), 1)}
              </div>
              <div className="flex flex-row gap-2">
                {recommended_for.map(attendeeType => (
                  <div className="p-1 bg-blue-200 rounded-lg w-fit">
                    {(ExperienceLevel as Record<string, string>)[attendeeType]}
                  </div>
                ))}
              </div>
            </div>
            <div className=" overflow-ellipsis">
              <div className="flex-grow ">{description}</div>
            </div>{' '}
            <div
              className={`border-opacity-0 bg-[#4D97E8] text-white mx-auto mt-4 border px-4 py-[6px] rounded-full text-xs  transition-all whitespace-nowrap`}
              onClick={handleSubmit}
            >
              Remove Workshop
            </div>
            <div className="flex flex-col items-center gap-2"></div>
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
