import React,{useState,useEffect} from 'react';

const CalendarImporter: React.FC = () => {
    const [event, setEvent] = useState({
      summary: 'Meeting with Team',
      description: 'Discuss project updates and upcoming tasks.',
      start_time: '2024-01-10T09:00:00',
      end_time: '2024-01-10T10:30:00'
    });
  
    useEffect(() => {
      // Load the Google API client library
      const loadGoogleAPI = async () => {
        await new Promise<void>((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://apis.google.com/js/api.js';
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
  
        await gapi.client.load('calendar', 'v3');
      };
  
      loadGoogleAPI();
    }, []);
  
    const handleAddEvent = async () => {
      if (!gapi || !gapi.client) {
        console.error('Google API client not loaded.');
        return;
      }
    
      // Replace 'YOUR_API_KEY' with your actual API key
      const API_KEY = '853883536423-u64asdjdrts620f3c10ahsocgbapqiua.apps.googleusercontent.com';
      const CALENDAR_ID = 'primary'; // Replace with your calendar ID
    
      try {
        // Create events using the API
        const startDateTime = new Date(event.start_time).toISOString();
        const endDateTime = new Date(event.end_time).toISOString();
    
        const newEvent = {
          summary: event.summary,
          description: event.description,
          start: { dateTime: startDateTime, timeZone: 'America/New_York' },
          end: { dateTime: endDateTime, timeZone: 'America/New_York' }
        };
    
        const result = await gapi.client.request({
          path: `calendar/v3/calendars/${CALENDAR_ID}/events`,
          method: 'POST',
          body: newEvent,
        });
    
        console.log('Event added:', result);
      } catch (error) {
        console.error('Error adding event:', error);
      }
    };
    
  
    return (
      <div>
        <button onClick={handleAddEvent}>Add Event to Calendar</button>
      </div>
    );
  };
  
  export default CalendarImporter