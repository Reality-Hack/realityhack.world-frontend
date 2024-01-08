import React, { useState } from 'react';
import axios from 'axios';
import { ICS } from 'ics';

const AppleCalendarImporter: React.FC = () => {
  const [event, setEvent] = useState({
    title: 'Meeting with Team',
    description: 'Discuss project updates and upcoming tasks.',
    start: '2024-01-10T09:00:00',
    end: '2024-01-10T10:30:00',
  });

  const handleAddEvent = async () => {
    try {
      const { title, description, start, end } = event;

      const eventObject = {
        start: [start.substr(0, 4), start.substr(5, 2), start.substr(8, 2), start.substr(11, 2), start.substr(14, 2)],
        duration: { hours: 1, minutes: 30 },
        title,
        description,
      };

      const { value } = ICS.createEvent(eventObject);

      // Your CalDAV server URL
      const caldavUrl = 'YOUR_CALDAV_SERVER_URL';

      await axios.put(caldavUrl, value, {
        headers: {
          'Content-Type': 'text/calendar',
        },
      });

      console.log('Event added to Apple Calendar.');
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <div>
      <button onClick={handleAddEvent}>Add Event to Apple Calendar</button>
    </div>
  );
};

export default AppleCalendarImporter;
