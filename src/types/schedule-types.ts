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
}

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}
