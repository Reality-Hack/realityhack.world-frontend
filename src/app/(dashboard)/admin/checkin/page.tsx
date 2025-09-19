'use client';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import QRCodeReader from '@/components/admin/QRCodeReader';
import CustomSelect from '@/components/CustomSelect';
import { updateAttendee } from '@/app/api/attendee';
import { Modal, Box, Alert } from '@mui/material';
import { useAttendees, useAttendee } from '@/hooks/useAttendees';
import { AttendeeList } from '@/types/models';
import { attendeesPartialUpdate } from '@/types/endpoints';

export default function Checkin() {
  const { data: session, status } = useSession();
  
  const { 
    attendees,
    isLoading: isLoadingAttendees,
    getCheckedInCount,
    getTotalCount,
    participationClassCounts,
    getAttendeeById,
    mutate
  } = useAttendees();
  
  const [selectedValue, setSelectedValue] = useState('');
  const [open, setOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [checkedInAttendee, setCheckedInAttendee] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState('');

  const { attendee: selectedAttendee } = useAttendee(selectedValue, { 
    fetchIndividual: false
  });

  const isAdmin = session && (session as any).roles?.includes('admin');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 400,
    bgcolor: 'background.paper',
    borderRadius: '10px',
    p: 4
  };

  const selectOptions = attendees?.map((attendee) => ({
    value: attendee.id || '',
    label: (
      <div className="flex flex-row items-center justify-start gap-2">
        {attendee.checked_in_at && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            className="w-4 h-4 min-w-4 min-h-4 max-w-4 max-h-4"
          >
            <path
              fill="#43a047"
              d="M32 2C15.431 2 2 15.432 2 32c0 16.568 13.432 30 30 30 16.568 0 30-13.432 30-30C62 15.432 48.568 2 32 2zm-6.975 48-.02-.02-.017.02L11 35.6l7.029-7.164 6.977 7.184 21-21.619L53 21.199 25.025 50z"
            />
          </svg>
        )}
        {`${attendee.first_name} ${attendee.last_name}`}
      </div>
    )
  })) || [];

  useEffect(() => {
    let timeout: any;
    if (showSuccessAlert) {
      timeout = setTimeout(() => setShowSuccessAlert(false), 4000);
    }
    return () => clearTimeout(timeout);
  }, [showSuccessAlert]);

  useEffect(() => {
    let timeout: any;
    if (showErrorAlert) {
      timeout = setTimeout(() => setShowErrorAlert(false), 4000);
    }
    return () => clearTimeout(timeout);
  }, [showErrorAlert]);

  const handleSelectChange = (value: any) => {
    setSelectedValue(value);
  };

  const handleCheckin = async (userId: string, scanned?: boolean) => {
    const attendee = getAttendeeById(userId);

    if (!attendee) {
      setShowErrorAlert(true);
      setErrorAlertMessage(`invalid QR code scanned.`);
      handleClose();
      return;
    }

    setSelectedValue(userId);

    try {
      const newCheckedInAt = attendee.checked_in_at ? null : new Date().toISOString();
      await mutate(
        async (currentAttendees: AttendeeList[] | undefined) => {
          await attendeesPartialUpdate(userId, {
            checked_in_at: newCheckedInAt
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session?.access_token}`
            }
          });
          
          if (!currentAttendees) return undefined;
          return currentAttendees.map(att => 
            att.id === userId 
              ? { ...att, checked_in_at: newCheckedInAt } 
              : att
          );
        },
        {
          optimisticData: (currentAttendees: AttendeeList[] | undefined) => {
            if (!currentAttendees) return [];
            return currentAttendees.map(att => 
              att.id === userId 
                ? { ...att, checked_in_at: newCheckedInAt } 
                : att
            );
          },
          rollbackOnError: true
        }
      );
      showAlert(
        `${attendee.first_name} ${attendee.last_name} has ${attendee.checked_in_at ? 'been checked out' : 'been checked in'}.`
      );
    } catch (error) {
      setShowErrorAlert(true);
      setErrorAlertMessage(`invalid QR code scanned.`);
    }
    handleClose();
  };

  const showAlert = (message: string) => {
    setCheckedInAttendee(message);
    setShowSuccessAlert(true);
  };

  const getParticipationClassName = (code: string) => {
    switch (code) {
      case 'P': return 'Hacker';
      case 'M': return 'Mentor';
      case 'J': return 'Judge';
      case 'S': return 'Sponsor';
      case 'V': return 'Volunteer';
      case 'O': return 'Organizer';
      case 'G': return 'Guardian';
      case 'E': return 'Media';
      default: return '';
    }
  };

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
                <button onClick={handleOpen}>
                  <img
                    src="/icons/dashboard/qr.svg"
                    alt="scan QR code"
                    className="mb-3 ml-3 "
                  />
                </button>
              </div>
              {selectedValue && selectedAttendee ? (
                <div className="flex items-center h-20 gap-2 pl-4 bg-white rounded">
                  {selectedAttendee.checked_in_at && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 64 64"
                      className="w-8 h-8"
                    >
                      <path
                        fill="#43a047"
                        d="M32 2C15.431 2 2 15.432 2 32c0 16.568 13.432 30 30 30 16.568 0 30-13.432 30-30C62 15.432 48.568 2 32 2zm-6.975 48-.02-.02-.017.02L11 35.6l7.029-7.164 6.977 7.184 21-21.619L53 21.199 25.025 50z"
                      />
                    </svg>
                  )}
                  <div className="flex flex-col">
                    <p>{selectedAttendee.first_name} {selectedAttendee.last_name}</p>
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
              {selectedValue && selectedAttendee && (
                <button
                  onClick={() => handleCheckin(selectedValue, true)}
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
                    {getTotalCount()}
                  </span>
                </div>
                <div className="flex flex-col items-center px-4 py-2 w-36 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
                  <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
                    Checked In
                  </span>
                  <span className="text-2xl font-semibold text-black text-opacity-90">
                    {getCheckedInCount()}
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
            open={open}
            onClose={handleClose}
            aria-labelledby="qr-code-reader-modal"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              {open && <QRCodeReader onScanSuccess={handleCheckin} />}
            </Box>
          </Modal>
          {showSuccessAlert && (
            <div
              className={`fixed top-0 left-0 m-4 z-[1001] transition-opacity w-[500px] ${
                showSuccessAlert ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <Alert
                severity="success"
                onClose={() => setShowSuccessAlert(false)}
              >
                {checkedInAttendee}
              </Alert>
            </div>
          )}
          {showErrorAlert && (
            <div
              className={`fixed top-0 left-0 m-4 z-[1001] transition-opacity w-[500px] ${
                showErrorAlert ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <Alert
                severity="error"
                onClose={() => setShowErrorAlert(false)}
              >
                {errorAlertMessage}
              </Alert>
            </div>
          )}
        </>
      )}
    </div>
  );
}
