import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Event } from '@/types/models';
import { useEventsGetActiveRetrieve, useEventsList } from '@/types/endpoints';

type EventsContextType = {
  selectedEvent: Event | null;
  setSelectedEvent: (event: Event | null) => void;
  allEvents: Event[] | null;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { data: allEvents } = useEventsList({});  
  const { data: activeEvent } = useEventsGetActiveRetrieve({});
  useEffect(() => {
    setSelectedEvent(activeEvent ?? null);
  }, [activeEvent]);
  return <EventsContext.Provider value={{ selectedEvent, setSelectedEvent, allEvents: allEvents ?? null }}>{children}</EventsContext.Provider>
}

export const useEvents = (): EventsContextType => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within EventsProvider');
  }
  return context;
}