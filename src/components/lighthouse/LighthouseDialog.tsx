import {
  AnnouncementStatus,
  MentorRequestStatus,
  MessageType
} from '@/app/api/lighthouse';
import {
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material';
import { useEffect, useState } from 'react';

const MessageTypeOptions: {
  label: string;
  value: MessageType;
}[] = [
  {
    label: 'Announcement',
    value: MessageType.ANNOUNCEMENT
  },
  {
    label: 'Mentor Request',
    value: MessageType.MENTOR_REQUEST
  }
];

const AnnouncementStatusOptions: {
  label: string;
  value: AnnouncementStatus;
}[] = [
  {
    label: 'Alert',
    value: AnnouncementStatus.ALERT
  },
  {
    label: 'Resolve',
    value: AnnouncementStatus.RESOLVE
  },
  {
    label: 'Send',
    value: AnnouncementStatus.SEND
  }
];

const MentorRequestStatusOptions: {
  label: string;
  value: MentorRequestStatus;
}[] = [
  {
    label: 'Requested',
    value: MentorRequestStatus.REQUESTED
  },
  {
    label: 'Acknowledged',
    value: MentorRequestStatus.ACKNOWLEDGED
  },
  {
    label: 'En Route',
    value: MentorRequestStatus.EN_ROUTE
  },
  {
    label: 'Resolved',
    value: MentorRequestStatus.RESOLVED
  }
];

type LighthouseDialogProps = {
  handleClose: () => void;
  dialogOpen: boolean;
  pendingTables: number[];
  onSubmit: (payload: any) => void;
  isMentor?: boolean;
};

export default function LighthouseDialog({
  handleClose,
  dialogOpen,
  pendingTables,
  onSubmit,
  isMentor
}: LighthouseDialogProps) {
  const [messageType, setMessageType] = useState<MessageType>(
    MessageType.MENTOR_REQUEST
  );
  const handleMessageTypeChange = (event: SelectChangeEvent) => {
    setMessageType(event.target.value as MessageType);
  };
  const [announcementStatus, setAnnouncementStatus] =
    useState<AnnouncementStatus>(AnnouncementStatus.SEND);
  const handleAnnouncementStatusChange = (event: SelectChangeEvent) => {
    setAnnouncementStatus(event.target.value as AnnouncementStatus);
  };
  const [mentorRequestStatus, setMentorRequestStatus] =
    useState<MentorRequestStatus>(MentorRequestStatus.REQUESTED);
  const handleMentorRequestStatusChange = (event: SelectChangeEvent) => {
    setMentorRequestStatus(event.target.value as MentorRequestStatus);
  };
  const [extra, setExtra] = useState<boolean>(false);
  const handleExtraChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtra(event.target.checked);
  };
  const [extraMessage, setExtraMessage] = useState<string>('');
  const handleExtraMessageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setExtraMessage(event.target.value);
  };

  useEffect(() => {
    setExtraMessage('');
  }, [extra]);

  useEffect(() => {
    setMessageType(MessageType.MENTOR_REQUEST);
    setAnnouncementStatus(AnnouncementStatus.SEND);
    setMentorRequestStatus(MentorRequestStatus.REQUESTED);
    setExtra(false);
    setExtraMessage('');
  }, [dialogOpen]);

  useEffect(() => {
    if (
      !(
        messageType === MessageType.ANNOUNCEMENT &&
        announcementStatus === AnnouncementStatus.ALERT
      )
    ) {
      setExtra(false);
      setExtraMessage('');
    }
  }, [messageType, announcementStatus]);

  const handleSubmit = () => {
    let extraJSON: any = null;
    try {
      extraJSON = JSON.parse(extraMessage);
    } catch {
      extraJSON = null;
    }
    const includeExtra = extra && !!extraJSON;
    onSubmit({
      tables: pendingTables,
      type: messageType,
      status:
        messageType === MessageType.ANNOUNCEMENT
          ? announcementStatus
          : mentorRequestStatus,
      extra: includeExtra ? extraJSON : undefined
    });
  };

  return (
    <Dialog onClose={handleClose} open={dialogOpen} maxWidth="sm" fullWidth>
      <DialogTitle>Send Message to Tables</DialogTitle>
      <DialogContent>
        <p className="break-all">Tables: {JSON.stringify(pendingTables)}</p>
        <Box>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 240 }}>
            <InputLabel id="message-type-select">Message Type</InputLabel>
            <Select
              disabled={isMentor}
              labelId="message-type-select"
              id="message-type-select"
              value={messageType}
              onChange={handleMessageTypeChange}
              label="Message Type"
            >
              {MessageTypeOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {messageType === MessageType.ANNOUNCEMENT && (
            <FormControl variant="standard" sx={{ m: 1, minWidth: 240 }}>
              <InputLabel id="announcement-status-select">
                Announcement Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={announcementStatus}
                onChange={handleAnnouncementStatusChange}
                label="Announcement Status"
              >
                {AnnouncementStatusOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {messageType === MessageType.MENTOR_REQUEST && (
            <FormControl variant="standard" sx={{ m: 1, minWidth: 240 }}>
              <InputLabel id="mentor-status-select">
                Mentor Request Status
              </InputLabel>
              <Select
                labelId="mentor-select-standard-label"
                id="mentor-select-standard"
                value={mentorRequestStatus}
                onChange={handleMentorRequestStatusChange}
                label="Mentor Request"
              >
                {MentorRequestStatusOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
        {messageType === MessageType.ANNOUNCEMENT &&
          announcementStatus === AnnouncementStatus.ALERT && (
            <>
              <FormControlLabel
                control={
                  <Checkbox onChange={handleExtraChange} value={extra} />
                }
                label="Extra"
              />
              {extra && (
                <Box>
                  <TextField
                    label="extra"
                    multiline
                    maxRows={5}
                    fullWidth
                    value={extraMessage}
                    onChange={handleExtraMessageChange}
                  />
                </Box>
              )}
            </>
          )}
      </DialogContent>
      <DialogActions>
        <button
          className="transition-all mt-4 bg-[#4D97E8] hover:bg-[#4589d2] px-7 py-2 rounded-full text-white disabled:opacity-50 disabled:hover:none disabled:pointer-events-none"
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          className="transition-all mt-4 bg-[#4D97E8] hover:bg-[#4589d2] px-7 py-2 rounded-full text-white disabled:opacity-50 disabled:hover:none disabled:pointer-events-none"
          onClick={handleSubmit}
        >
          Send
        </button>
      </DialogActions>
    </Dialog>
  );
}
