'use client';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import QRCodeReader from '@/components/admin/QRCodeReader';
import CustomSelect from '@/components/CustomSelect';
import { Modal, Box, Alert } from '@mui/material';
import { eventrsvpsPartialUpdate } from '@/types/endpoints';
import { EventRsvp } from '@/types/models';
import { useEventRsvps } from '@/hooks/useEventRsvps';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 400,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  p: 4
};

const PARTICIPATION_CLASS_NAMES: Record<string, string> = {
  'P': 'Hacker',
  'M': 'Mentor',
  'J': 'Judge',
  'S': 'Sponsor',
  'V': 'Volunteer',
  'O': 'Organizer',
  'G': 'Guardian',
  'E': 'Media',
};

const getParticipationClassName = (code: string) => 
  PARTICIPATION_CLASS_NAMES[code] || '';

const CheckmarkIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className}>
    <path
      fill="#43a047"
      d="M32 2C15.431 2 2 15.432 2 32c0 16.568 13.432 30 30 30 16.568 0 30-13.432 30-30C62 15.432 48.568 2 32 2zm-6.975 48-.02-.02-.017.02L11 35.6l7.029-7.164 6.977 7.184 21-21.619L53 21.199 25.025 50z"
    />
  </svg>
);

type AlertState = {
  type: 'success' | 'error' | null;
  message: string;
};

export default function Checkin() {
  const { data: session, status } = useSession();
  
  const { 
    eventRsvps, 
    getTotalCount,
    getCheckedInCount,
    participationClassCounts, 
    rsvpByAttendeeId,
    mutate
  } = useEventRsvps();

  const [selectedValue, setSelectedValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState<AlertState>({ type: null, message: '' });

  const selectedAttendee = useMemo(() => 
    selectedValue ? rsvpByAttendeeId(selectedValue) : null
  , [selectedValue, eventRsvps]);

  const isAdmin = session && (session as any).roles?.includes('admin');

  const selectOptions = useMemo(() => 
    eventRsvps?.map((rsvp: EventRsvp) => ({
      value: rsvp.attendee?.id || '',
      label: (
        <div className="flex flex-row items-center justify-start gap-2">
          {rsvp.checked_in_at && <CheckmarkIcon className="w-4 h-4 min-w-4 min-h-4 max-w-4 max-h-4" />}
          {`${rsvp.attendee?.first_name} ${rsvp.attendee?.last_name}`}
        </div>
      )
    })) || []
  , [eventRsvps]);

  // Single alert timeout effect
  useEffect(() => {
    if (!alert.type) return;
    const timeout = setTimeout(() => setAlert({ type: null, message: '' }), 4000);
    return () => clearTimeout(timeout);
  }, [alert.type, alert.message]);

  const handleSelectChange = useCallback((value: string) => {
    setSelectedValue(value);
  }, []);

  const handleCheckin = useCallback(async (attendeeId: string) => {
    const rsvp = rsvpByAttendeeId(attendeeId);
    
    if (!rsvp?.id) {
      setAlert({ type: 'error', message: 'Invalid QR code - no RSVP found.' });
      setIsModalOpen(false);
      return;
    }

    setSelectedValue(attendeeId);

    try {
      const isCheckingIn = !rsvp.checked_in_at;
      const newCheckedInAt = isCheckingIn ? new Date().toISOString() : null;
      
      await eventrsvpsPartialUpdate(rsvp.id, {
        checked_in_at: newCheckedInAt
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      
      mutate();
      
      setAlert({
        type: 'success',
        message: `${rsvp.attendee?.first_name} ${rsvp.attendee?.last_name} has been ${isCheckingIn ? 'checked in' : 'checked out'}.`
      });
    } catch (error) {
      console.error('Check-in error:', error);
      setAlert({ type: 'error', message: 'Failed to check in user. Please try again.' });
    }
    setIsModalOpen(false);
  }, [rsvpByAttendeeId, session?.access_token, mutate]);

  if (!isAdmin) {
    return <div>You are not authorized to access this page</div>;
  }

  return (
    <div className="h-screen p-6">
      {status === 'authenticated' && (
        <>
          <h1 className="mb-16 text-2xl">User Checkin</h1>
          <hr className="mb-6" />
          <span className="pb-6 text-lg font-medium">Search Participants</span>
          <div className="grid gap-4 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
            <div className="p-4 max-w-[366px] min-h-[156px] bg-[#F4F4F4] rounded mx-auto sm:mx-0">
              <div className="flex">
                <CustomSelect
                  label="Search by"
                  options={selectOptions}
                  value={selectedValue}
                  onChange={handleSelectChange}
                  search={true}
                />
                <button onClick={() => setIsModalOpen(true)}>
                  <img src="/icons/dashboard/qr.svg" alt="scan QR code" className="mb-3 ml-3" />
                </button>
              </div>
              {selectedAttendee ? (
                <div className="flex items-center h-20 gap-2 pl-4 bg-white rounded">
                  {selectedAttendee.checked_in_at && <CheckmarkIcon className="w-8 h-8" />}
                  <div className="flex flex-col">
                    <p>{selectedAttendee.attendee?.first_name} {selectedAttendee.attendee?.last_name}</p>
                    <div className="w-fit h-5 px-2 bg-neutral-800 rounded-[5px] flex justify-center items-center text-xs mt-2 text-white">
                      {getParticipationClassName(selectedAttendee.participation_class || '')}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center h-20 gap-2 pl-4 bg-white rounded">
                  <span>Select or scan a user to continue</span>
                </div>
              )}
              {selectedAttendee && (
                <button
                  onClick={() => handleCheckin(selectedValue)}
                  className="px-4 py-2 mt-4 ml-auto text-white bg-blue-500 rounded font-xs hover:bg-blue-700"
                >
                  <p className="text-sm">
                    {selectedAttendee.checked_in_at ? 'Remove Check In' : 'Check In User'}
                  </p>
                </button>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center justify-center gap-4">
                <div className="flex flex-col items-center px-4 py-2 w-36 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
                  <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
                    Total Attendees
                  </span>
                  <span className="text-2xl font-semibold text-black text-opacity-90">
                    {getTotalCount}
                  </span>
                </div>
                <div className="flex flex-col items-center px-4 py-2 w-36 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
                  <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
                    Checked In
                  </span>
                  <span className="text-2xl font-semibold text-black text-opacity-90">
                    {getCheckedInCount}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {Object.entries(participationClassCounts).map(([classType, counts]) => (
                  <div
                    key={classType}
                    className="flex flex-col items-center px-4 py-2 w-36 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5"
                  >
                    <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
                      {getParticipationClassName(classType)}s
                    </span>
                    <span className="text-2xl font-semibold text-black text-opacity-90">
                      {counts.checkedIn}/{counts.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            aria-labelledby="qr-code-reader-modal"
          >
            <Box sx={modalStyle}>
              {isModalOpen && <QRCodeReader onScanSuccess={handleCheckin} />}
            </Box>
          </Modal>

          {alert.type && (
            <div className="fixed top-0 left-0 m-4 z-[1001] w-[500px]">
              <Alert severity={alert.type} onClose={() => setAlert({ type: null, message: '' })}>
                {alert.message}
              </Alert>
            </div>
          )}
        </>
      )}
    </div>
  );
}
