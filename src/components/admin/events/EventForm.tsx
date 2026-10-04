import { useMemo, useState } from 'react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { TextInput } from '@/components/Inputs';
import CustomSelect from '@/components/CustomSelect';
import AppButton from '@/components/common/AppButton';
import { useEventsCreate, useEventsPartialUpdate } from '@/types/endpoints';
import { Event, EventRequest } from '@/types/models';
import {
  COMMON_EVENT_TIMEZONES,
  DateTimeInputs,
  DateTimeWindow,
  DEFAULT_EVENT_TIMEZONE,
  eventInputsToUtcIso,
  getDefaultJudgingWindow,
  getDefaultMentorWindow,
  getJudgingWindow,
  getMentorWindow,
  isoToEventInputs,
} from '@/app/utils/eventDateUtils';

type EventFormProps = {
  /** When provided the form edits this event; otherwise it creates a new one. */
  event?: Event;
  onSuccess?: (event: Event) => void;
  onCancel?: () => void;
};

type WindowInputs = { start: DateTimeInputs; end: DateTimeInputs };

const EMPTY_INPUTS: DateTimeInputs = { date: '', time: '' };

function windowToInputs(window: DateTimeWindow, timezone: string): WindowInputs {
  return {
    start: isoToEventInputs(window.start, timezone),
    end: isoToEventInputs(window.end, timezone),
  };
}

function isBlank(inputs: DateTimeInputs): boolean {
  return !inputs.date.trim() && !inputs.time.trim();
}

function getTimezoneOptions(current: string): { value: string; label: string }[] {
  const all = typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : [];
  const zones = Array.from(new Set([...COMMON_EVENT_TIMEZONES, current, ...all]));
  return zones.map((zone) => ({ value: zone, label: zone }));
}

function getApiErrorMessage(e: unknown): string | null {
  if (!isAxiosError(e) || !e.response?.data || typeof e.response.data !== 'object') {
    return null;
  }
  const [field, messages] = Object.entries(e.response.data as Record<string, unknown>)[0] ?? [];
  if (!field) return null;
  const message = Array.isArray(messages) ? messages[0] : messages;
  return `${field}: ${String(message)}`;
}

function DateTimeField({
  name,
  label,
  value,
  onChange,
}: {
  name: string;
  label: string;
  value: DateTimeInputs;
  onChange: (value: DateTimeInputs) => void;
}): JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-4">
      <TextInput
        name={`${name}-date`}
        value={value.date}
        onChange={(e) => onChange({ ...value, date: e.target.value })}
        placeholder={`${label} Date`}
        type="date"
      >
        {label} Date
      </TextInput>
      <TextInput
        name={`${name}-time`}
        value={value.time}
        onChange={(e) => onChange({ ...value, time: e.target.value })}
        placeholder={`${label} Time`}
        type="time"
      >
        {label} Time
      </TextInput>
    </div>
  );
}

function SectionHeader({
  title,
  description,
  onReset,
}: {
  title: string;
  description?: string;
  onReset?: () => void;
}): JSX.Element {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg">{title}</h2>
        {onReset ? (
          <button
            type="button"
            className="text-sm text-themePrimary hover:underline"
            onClick={onReset}
          >
            Reset to default
          </button>
        ) : null}
      </div>
      {description ? <HelperText>{description}</HelperText> : null}
    </div>
  );
}

function HelperText({ children }: { children: React.ReactNode }): JSX.Element {
  return <span className="block text-xs text-gray-500">{children}</span>;
}

/** Input label with a line of helper text explaining where the field is used. */
function FieldLabel({ label, help }: { label: string; help: string }): JSX.Element {
  return (
    <>
      {label}
      <HelperText>{help}</HelperText>
    </>
  );
}

export default function EventForm({ event, onSuccess, onCancel }: EventFormProps): JSX.Element {
  const isEdit = !!event;
  const initialTimezone = event?.timezone ?? DEFAULT_EVENT_TIMEZONE;

  const [name, setName] = useState(event?.name ?? '');
  const [timezone, setTimezone] = useState(initialTimezone);
  const [start, setStart] = useState(() => isoToEventInputs(event?.start_date, initialTimezone));
  const [end, setEnd] = useState(() => isoToEventInputs(event?.end_date, initialTimezone));
  // Mentor/judging windows pre-fill with the defaults when unset, so the first
  // save of the edit form persists them; admins can override from there.
  const [mentor, setMentor] = useState<WindowInputs>(() =>
    event ? windowToInputs(getMentorWindow(event), initialTimezone) : { start: EMPTY_INPUTS, end: EMPTY_INPUTS },
  );
  const [judging, setJudging] = useState<WindowInputs>(() =>
    event ? windowToInputs(getJudgingWindow(event), initialTimezone) : { start: EMPTY_INPUTS, end: EMPTY_INPUTS },
  );
  const [rsvpDeadline, setRsvpDeadline] = useState(() =>
    isoToEventInputs(event?.rsvp_deadline, initialTimezone),
  );
  const [discordUrl, setDiscordUrl] = useState(event?.discord_url ?? '');
  const [specialTracksUrl, setSpecialTracksUrl] = useState(event?.special_tracks_url ?? '');
  const [parentConsentFormUrl, setParentConsentFormUrl] = useState(
    event?.parent_consent_form_url ?? '',
  );
  const [discountsPageUrl, setDiscountsPageUrl] = useState(event?.discounts_page_url ?? '');

  const { trigger: createEvent, isMutating: isCreating } = useEventsCreate();
  const { trigger: updateEvent, isMutating: isUpdating } = useEventsPartialUpdate(event?.id ?? '');
  const isMutating = isCreating || isUpdating;

  const timezoneOptions = useMemo(() => getTimezoneOptions(timezone), [timezone]);

  const trimmedName = name.trim();
  // Changing the timezone keeps the entered wall-clock values and reinterprets
  // them in the new zone, since every conversion happens here at submit time.
  const startIso = eventInputsToUtcIso(start, timezone);
  const endIso = eventInputsToUtcIso(end, timezone);
  const canSubmit = trimmedName.length > 0 && startIso !== null && endIso !== null && !isMutating;

  const resetWindow = (
    getDefault: typeof getDefaultMentorWindow,
    setWindow: (value: WindowInputs) => void,
  ): void => {
    if (!startIso || !endIso) {
      toast.error('Set the event start and end first');
      return;
    }
    setWindow(
      windowToInputs(getDefault({ start_date: startIso, end_date: endIso, timezone }), timezone),
    );
  };

  /** Returns [start, end] ISO strings, nulls when blank, or an error message. */
  const parseWindow = (
    label: string,
    window: WindowInputs,
  ): [string | null, string | null] | string => {
    if (isBlank(window.start) && isBlank(window.end)) return [null, null];
    const windowStart = eventInputsToUtcIso(window.start, timezone);
    const windowEnd = eventInputsToUtcIso(window.end, timezone);
    if (!windowStart || !windowEnd) return `${label} needs both a start and end date and time`;
    if (windowEnd <= windowStart) return `${label} end must be after its start`;
    return [windowStart, windowEnd];
  };

  const handleSubmit = async (): Promise<void> => {
    if (!canSubmit || !startIso || !endIso) {
      toast.error('Please fill in all fields');
      return;
    }

    if (endIso <= startIso) {
      toast.error('End date and time must be after the start');
      return;
    }

    try {
      if (!isEdit) {
        const body: EventRequest = {
          name: trimmedName,
          start_date: startIso,
          end_date: endIso,
          timezone,
        };
        const created = await createEvent(body);
        toast.success('Event created');
        setName('');
        setStart(EMPTY_INPUTS);
        setEnd(EMPTY_INPUTS);
        onSuccess?.(created);
        return;
      }

      const mentorWindow = parseWindow('Mentor window', mentor);
      if (typeof mentorWindow === 'string') {
        toast.error(mentorWindow);
        return;
      }
      const judgingWindow = parseWindow('Judging window', judging);
      if (typeof judgingWindow === 'string') {
        toast.error(judgingWindow);
        return;
      }
      if (!isBlank(rsvpDeadline) && !eventInputsToUtcIso(rsvpDeadline, timezone)) {
        toast.error('RSVP deadline needs both a date and time');
        return;
      }

      const updated = await updateEvent({
        name: trimmedName,
        start_date: startIso,
        end_date: endIso,
        timezone,
        mentor_start_date: mentorWindow[0],
        mentor_end_date: mentorWindow[1],
        judging_start_date: judgingWindow[0],
        judging_end_date: judgingWindow[1],
        rsvp_deadline: eventInputsToUtcIso(rsvpDeadline, timezone),
        discord_url: discordUrl.trim() || null,
        special_tracks_url: specialTracksUrl.trim() || null,
        parent_consent_form_url: parentConsentFormUrl.trim() || null,
        discounts_page_url: discountsPageUrl.trim() || null,
      });
      toast.success('Event updated');
      onSuccess?.(updated);
    } catch (e) {
      console.error(e);
      const apiError = getApiErrorMessage(e);
      const action = isEdit ? 'update' : 'create';
      toast.error(apiError ? `Failed to ${action} event (${apiError})` : `Failed to ${action} event`);
    }
  };

  const submitLabel = isEdit ? 'Save' : 'Create';
  const pendingLabel = isEdit ? 'Saving…' : 'Creating…';

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
      <div className="mb-6">
        <p>Timezone</p>
        <CustomSelect
          label="Timezone"
          value={timezone}
          onChange={setTimezone}
          options={timezoneOptions}
          search
          width="100%"
        />
        <p className="mt-1 text-xs text-gray-500">
          All dates and times below are entered in this timezone ({timezone}). Event dates are
          shown in it everywhere: the admin pages, application and RSVP forms, homepage, and
          emails.
        </p>
      </div>
      <DateTimeField name="event-start" label="Start" value={start} onChange={setStart} />
      <DateTimeField name="event-end" label="End" value={end} onChange={setEnd} />

      {isEdit ? (
        <>
          <SectionHeader
            title="Mentor Window"
            description="Shown on the mentor application form and its review step as the dates mentors must be available. Defaults to starting with the event and leaving a day early."
            onReset={() => resetWindow(getDefaultMentorWindow, setMentor)}
          />
          <DateTimeField
            name="mentor-start"
            label="Mentor Start"
            value={mentor.start}
            onChange={(value) => setMentor({ ...mentor, start: value })}
          />
          <DateTimeField
            name="mentor-end"
            label="Mentor End"
            value={mentor.end}
            onChange={(value) => setMentor({ ...mentor, end: value })}
          />

          <SectionHeader
            title="Judging Window"
            description="Sets judging day and arrival/departure times on the judge application form, the judge homepage, and the judge RSVP request email. Defaults to the last day of the event."
            onReset={() => resetWindow(getDefaultJudgingWindow, setJudging)}
          />
          <DateTimeField
            name="judging-start"
            label="Judging Start"
            value={judging.start}
            onChange={(value) => setJudging({ ...judging, start: value })}
          />
          <DateTimeField
            name="judging-end"
            label="Judging End"
            value={judging.end}
            onChange={(value) => setJudging({ ...judging, end: value })}
          />

          <SectionHeader
            title="RSVP"
            description="The RSVP deadline appears in the hacker RSVP request email (only the date is shown). Leave blank to omit the deadline sentence."
          />
          <DateTimeField
            name="rsvp-deadline"
            label="RSVP Deadline"
            value={rsvpDeadline}
            onChange={setRsvpDeadline}
          />

          <SectionHeader title="Links" />
          <TextInput
            name="discord-url"
            value={discordUrl}
            onChange={(e) => setDiscordUrl(e.target.value)}
            placeholder="https://discord.gg/..."
            type="url"
          >
            <FieldLabel
              label="Discord URL"
              help="Used for the homepage “Join our Discord” buttons and in the hacker and mentor RSVP request emails. Leave blank to hide them."
            />
          </TextInput>
          <TextInput
            name="special-tracks-url"
            value={specialTracksUrl}
            onChange={(e) => setSpecialTracksUrl(e.target.value)}
            placeholder="https://..."
            type="url"
          >
            <FieldLabel
              label="Special Tracks URL"
              help="Linked from the special tracks paragraph in the hacker RSVP request email. Leave blank to omit that paragraph."
            />
          </TextInput>
          <TextInput
            name="parent-consent-form-url"
            value={parentConsentFormUrl}
            onChange={(e) => setParentConsentFormUrl(e.target.value)}
            placeholder="https://..."
            type="url"
          >
            <FieldLabel
              label="Parent Consent Form URL"
              help="Shown on the RSVP form to participants who will be under 18 at the event start. If blank, they're asked to email apply@realityhackinc.org instead."
            />
          </TextInput>
          <TextInput
            name="discounts-page-url"
            value={discountsPageUrl}
            onChange={(e) => setDiscountsPageUrl(e.target.value)}
            placeholder="https://..."
            type="url"
          >
            <FieldLabel
              label="Discounts Page URL"
              help="Linked from the Travel & Accommodations card on the homepage. Leave blank to hide the discounts note."
            />
          </TextInput>
        </>
      ) : null}

      <div className="flex justify-end gap-2 mt-2">
        {onCancel ? (
          <AppButton onClick={onCancel} disabled={isMutating}>
            Cancel
          </AppButton>
        ) : null}
        <AppButton onClick={() => void handleSubmit()} disabled={!canSubmit}>
          {isMutating ? pendingLabel : submitLabel}
        </AppButton>
      </div>
    </div>
  );
}
