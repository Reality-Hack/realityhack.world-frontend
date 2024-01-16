export interface Room {
  color: string;
  name: string;
}

export interface LegendRoomProps {
  color: string;
  name: string;
}

export interface ScheduleRoomProps {
  id:string;
  color: string;
  location: string;
  datetime: string;
  duration: number;
  workshopName: string;
  description: string;
  skills: [string];
  // recommended: ExperienceLevel[];
}

export interface WorkshopAttendeeListItem {
  id:string,
  participation:string,
  created_at:string,
  updated_at:string,
  workshop:string, //workshop id
  attendee:string
}

export enum ExperienceLevel {
  A = 'Atendee',
  P = 'Professional',
  D = 'Designer',
  S = 'Student'
}

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}
