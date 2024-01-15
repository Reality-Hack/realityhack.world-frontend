export interface Room {
  color: string;
  name: string;
}

export interface LegendRoomProps {
  color: string;
  name: string;
}

export interface ScheduleRoomProps {
  color: string;
  location: string;
  time: string;
  duration: number;
  workshopName: string;
  description: string;
  skills: [string];
  recommended: ExperienceLevel[];
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
