import { useState } from 'react';
import { DateTime } from 'luxon';
import { toast } from 'sonner';
import { TextInput } from '@/components/Inputs';
import AppButton from '@/components/common/AppButton';
import { useEventsCreate } from '@/types/endpoints';
import { EventRequest } from '@/types/models';

type CreateEventFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

function combineLocalDateTimeToIso(date: string, time: string): string | null {
  const d = date.trim();
  const t = time.trim();
  if (!d || !t) return null;
  const dt = DateTime.fromISO(`${d}T${t}`);
  if (!dt.isValid) return null;
  return dt.toISO();
}

export default function CreateEventForm({ onSuccess, onCancel }: CreateEventFormProps): JSX.Element {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const { trigger: createEvent, isMutating } = useEventsCreate();

  const trimmedName = name.trim();
  const startIso = combineLocalDateTimeToIso(startDate, startTime);
  const endIso = combineLocalDateTimeToIso(endDate, endTime);
  const canSubmit =
    trimmedName.length > 0 &&
    startIso !== null &&
    endIso !== null &&
    !isMutating;

  const handleSubmit = async (): Promise<void> => {
    if (!canSubmit || !startIso || !endIso) {
      toast.error('Please fill in all fields');
      return;
    }

    if (DateTime.fromISO(endIso) <= DateTime.fromISO(startIso)) {
      toast.error('End date and time must be after the start');
      return;
    }

    const body: EventRequest = {
      name: trimmedName,
      start_date: startIso,
      end_date: endIso,
    };

    try {
      await createEvent(body);
      toast.success('Event created');
      setName('');
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
      onSuccess?.();
    } catch (e) {
      console.error(e);
      toast.error('Failed to create event');
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-2">
      <div>
        <TextInput
          name="event-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Event Name"
        >
          Event Name
        </TextInput>
      </div>
      <div>
        <TextInput
          name="event-start-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
          type="date"
        >
          Start Date
        </TextInput>
      </div>
      <div>
        <TextInput
          name="event-start-time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          placeholder="Start Time"
          type="time"
        >
          Start Time
        </TextInput>
      </div>
      <div>
        <TextInput
          name="event-end-date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
          type="date"
        >
          End Date
        </TextInput>
      </div>
      <div>
        <TextInput
          name="event-end-time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          placeholder="End Time"
          type="time"
        >
          End Time
        </TextInput>
      </div>

      <div className="flex justify-end gap-2 mt-2">
        {onCancel ? (
          <AppButton onClick={onCancel} disabled={isMutating}>
            Cancel
          </AppButton>
        ) : null}
        <AppButton onClick={() => void handleSubmit()} disabled={!canSubmit}>
          {isMutating ? 'Creating…' : 'Create'}
        </AppButton>
      </div>
    </div>
  );
}
