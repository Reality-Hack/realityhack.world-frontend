'use client';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { Button } from 'antd';
import { useSession } from '@/auth/client';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useHardwarerequestsCreate } from '@/types/endpoints';
import { HardwareRequestCreateRequest, HardwareCount, HardwareRequestStatusEnum } from '@/types/models';
import { useEventParticipants, AttendeeWithCheckIn } from '@/contexts/EventParticipantsContext';
import { useHardwareContext } from '@/contexts/HardwareContext';

type AdminHardwareRequestFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
  preselectedAttendee?: AttendeeWithCheckIn | null;
};

export default function AdminHardwareRequestForm({ 
  onSuccess, 
  onCancel,
  preselectedAttendee = null,
}: AdminHardwareRequestFormProps) {
  const { data: session } = useSession();
  const { 
    rsvpAttendeesWithCheckIn: attendees,
    isLoadingRsvps: attendeesLoading,
    teamByAttendeeId,
    attendeeIdRsvpMap,
  } = useEventParticipants();
  
  const {
    hardwareDeviceTypes,
    isLoadingHardwareDeviceTypes,
    mutateHardwareRequests,
  } = useHardwareContext();

  const [selectedAttendee, setSelectedAttendee] = useState<AttendeeWithCheckIn | null>(preselectedAttendee);
  const isAttendeePreselected = !!preselectedAttendee;
  const [selectedHardware, setSelectedHardware] = useState<HardwareCount | null>(null);
  const [reason, setReason] = useState('');

  const { trigger: createHardwareRequest, isMutating } = useHardwarerequestsCreate({
    request: {
      headers: {
        Authorization: `Bearer ${session?.access_token}`
      }
    }
  });

  // Get team for selected attendee
  const selectedTeam = useMemo(() => {
    if (!selectedAttendee?.id) return null;
    return teamByAttendeeId(selectedAttendee.id);
  }, [selectedAttendee, teamByAttendeeId]);

  // Get email for selected attendee from RSVP
  const selectedAttendeeEmail = useMemo(() => {
    if (!selectedAttendee?.id) return null;
    const rsvp = attendeeIdRsvpMap[selectedAttendee.id];
    return rsvp?.attendee?.email || selectedAttendee.email;
  }, [selectedAttendee, attendeeIdRsvpMap]);

  // Validation
  const hasTeam = !!selectedTeam;
  const canSubmit = selectedAttendee && selectedHardware && hasTeam && !isMutating;

  const handleSubmit = async () => {
    if (!canSubmit || !selectedAttendeeEmail || !selectedHardware?.id || !selectedTeam?.id) {
      toast.error('Please fill in all required fields');
      return;
    }

    const requestBody: HardwareRequestCreateRequest = {
      hardware: selectedHardware.id,
      requester: selectedAttendeeEmail,
      reason: reason,
      team: selectedTeam.id,
      status: HardwareRequestStatusEnum.A, // Approved by default
    };

    try {
      await createHardwareRequest(requestBody);
      toast.success('Hardware request created successfully');
      mutateHardwareRequests();
      // Reset form
      setSelectedAttendee(null);
      setSelectedHardware(null);
      setReason('');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to create hardware request');
      console.error('Error creating hardware request:', error);
    }
  };

  const getAttendeeLabel = (attendee: AttendeeWithCheckIn): string => {
    return `${attendee.first_name} ${attendee.last_name}`;
  };

  const getHardwareLabel = (hardware: HardwareCount): string => {
    return `${hardware.name} (${hardware.available} available)`;
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Attendee Selector */}
      <Autocomplete
        options={attendees || []}
        getOptionLabel={getAttendeeLabel}
        value={selectedAttendee}
        onChange={(_, newValue) => setSelectedAttendee(newValue)}
        loading={attendeesLoading}
        disabled={isAttendeePreselected}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Attendee"
            placeholder="Search by name..."
            required
          />
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />

      {/* Team Display / Validation */}
      {selectedAttendee && !hasTeam && (
        <Alert severity="error">
          This attendee does not have a team. They must be assigned to a team before requesting hardware.
        </Alert>
      )}
      {selectedAttendee && hasTeam && (
        <Alert severity="info">
          Team: {selectedTeam?.name} {selectedTeam?.number ? `(#${selectedTeam.number})` : ''}
        </Alert>
      )}

      {/* Hardware Type Selector */}
      <Autocomplete
        options={hardwareDeviceTypes || []}
        getOptionLabel={getHardwareLabel}
        value={selectedHardware}
        onChange={(_, newValue) => setSelectedHardware(newValue)}
        loading={isLoadingHardwareDeviceTypes}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Hardware Type"
            placeholder="Search hardware..."
            required
          />
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />

      {/* Reason Textarea */}
      <TextField
        label="Reason for Request"
        placeholder="Why is this hardware needed?"
        multiline
        rows={3}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        inputProps={{ maxLength: 1000 }}
        helperText={`${reason.length}/1000 characters`}
      />

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        {onCancel && (
          <Button onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="primary"
          onClick={handleSubmit}
          disabled={!canSubmit}
          loading={isMutating}
        >
          Create Request
        </Button>
      </div>
    </div>
  );
}
