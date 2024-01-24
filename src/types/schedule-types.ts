export interface Room {
  color: string;
  name: string;
}

export interface LegendRoomProps {
  color: string;
  name: string;
}

export interface ScheduleRoomProps {
  id: string | null;
  color: string;
  location: string;
  datetime: string;
  duration: number;
  workshopName: string;
  description: string;
  skills: [string];
  recommended_for: ExperienceLevel[];
}
export interface Workshop {
  id: string;
  color: string;
  location: string;
  datetime: string;
  duration: number;
  name: string;
  description: string;
  skills: [string];
  recommended_for: ExperienceLevel[];
}

export interface WorkshopAttendeeListItem {
  id: string;
  participation: string;
  created_at: string;
  updated_at: string;
  workshop: string; //workshop id
  attendee: string;
}

export enum ExperienceLevel {
  A = 'Attendee',
  P = 'Professional',
  D = 'Designer',
  S = 'Student'
}

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}
