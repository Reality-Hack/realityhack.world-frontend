'use client';
import React, { useState, useEffect } from 'react';

interface TimeComponentProps {
  time: number;
  location: string;
}

export default function TimeComponent({ time }: TimeComponentProps) {
  const [amOrPm, setAmOrPm] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (time >= 5) {
      setAmOrPm('pm');
      setTimeSlot(`${time - 5}`);
      if (time === 5) {
        setTimeSlot('12');
      }
    } else {
      setAmOrPm('am');
      setTimeSlot(`${time}`);
    }
  }),
    [];

  return (
    <div
      className={`text-zinc-500 text-base font-light leading-normal grid-col-${timeSlot}`}
    >
      {timeSlot}
    </div>
  );
}
