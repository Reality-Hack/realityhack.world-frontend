'use client';
import { getAllAttendees } from '@/app/api/attendee';
import {
  getAllAttendedWorkshops,
  getAllWorkshops,
  getMyWorkshops,
  signinToWorkshop
} from '@/app/api/workshops';
import CustomSelect from '@/components/CustomSelect';
import QRCodeReader from '@/components/admin/QRCodeReader';
import { Alert, Box, Modal } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Checkin() {
  const [attendees, setAttendees] = useState<[]>([]);
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [open, setOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [checkedInAttendee, setCheckedInAttendee] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState('');
  const [attendeeDetails, setAttendeeDetails] = useState<any>(null);
  const [workshops, setWorkshops] = useState<any>(null);
  const [workshopOptions, setWorkshopOptions] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState('');
  const [registeredWorkshops, setRegisteredWorkshops] = useState<[]>([]);
  const [myWorkshops, setMyWorkshops] = useState<[]>([]);
  const [attendedWorkshops, setAttendedWorkshops] = useState<[]>([]);

  const { data: session, status } = useSession();
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

  useEffect(() => {
    if (isAdmin && session?.access_token) {
      const getData = async () => {
        const data = await getAllAttendees(session.access_token);
        setAttendees(data);
        const namesOptions = data.map((attendee: any) => ({
          value: attendee.id,
          label: `${attendee.first_name} ${attendee.last_name}`
        }));
        setSelectOptions(namesOptions);
      };
      getData();
    }
  }, [isAdmin, session?.access_token, showSuccessAlert]);

  useEffect(() => {
    if (session?.access_token) {
      getAllWorkshops(session.access_token).then(data => {
        setWorkshops(data);

        const transformedOptions = data.map((workshop: any) => {
          const parts = workshop.name
            .split('-')
            .map((part: string) => part.trim());

          const displayName = parts.slice(3).join(' - ');

          return {
            label: displayName,
            value: workshop.id
          };
        });

        setWorkshopOptions(transformedOptions);
      });
    }
  }, [session]);

  const fetchWorkshops = async () => {
    try {
      if (session) {
        const allWorkshops = await getAllAttendedWorkshops(
          session.access_token
        );
        setAttendedWorkshops(allWorkshops);
      }
    } catch (error) {
      console.error('Error fetching workshops:', error);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, [selectedWorkshop]);

  const fetchMyWorkshopData = async () => {
    try {
      if (session?.access_token && selectedValue) {
        const myWorkshopsData = await getMyWorkshops(
          session.access_token,
          selectedValue
        );
        setMyWorkshops(myWorkshopsData);

        const completedWorkshops = myWorkshopsData.filter(
          (w: any) => w.participation === 'C'
        );
        setRegisteredWorkshops(completedWorkshops);
      }
    } catch (error) {
      console.error('Error fetching myWorkshops:', error);
    }
  };

  useEffect(() => {
    if (session?.access_token && selectedValue) {
      fetchMyWorkshopData();
    }
  }, [session, selectedValue]);

  useEffect(() => {
    let timeout: any;
    if (showSuccessAlert) {
      timeout = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [showSuccessAlert]);

  useEffect(() => {
    let timeout: any;
    if (showErrorAlert) {
      timeout = setTimeout(() => {
        setShowErrorAlert(false);
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [showErrorAlert]);

  useEffect(() => {
    if (selectedValue) {
      fetchAttendeeDetails(selectedValue);
    } else {
      setAttendeeDetails(null);
    }
  }, [selectedValue, attendees]);

  const fetchAttendeeDetails = async (id: string) => {
    const attendee = (attendees as unknown as any[])?.find(a => a.id === id);
    if (attendee) {
      setAttendeeDetails({
        firstName: attendee.first_name,
        lastName: attendee.last_name,
        checkedInAt: attendee.checked_in_at,
        participationClass: attendee.participation_class
      });
    }
  };

  const handleSelectChange = async (value: any) => {
    setRegisteredWorkshops([]);
    setSelectedValue(value);
  };

  const handleCheckin = async (userId: string, scanned?: boolean) => {
    const selectedWorkshopDetails = myWorkshops.find(
      (workshop: any) => workshop.workshop === selectedWorkshop
    );

    const attendee = (attendees as unknown as any[])?.find(
      (a: any) => a.id === userId
    );

    if (!selectedWorkshopDetails) {
      setShowErrorAlert(true);
      setErrorAlertMessage(
        `${attendee.first_name} ${attendee.last_name} is not registered to this workshop.`
      );
      handleClose();
      return;
    }

    if (!attendee) {
      setShowErrorAlert(true);
      setErrorAlertMessage(`invalid QR code scanned.`);
      handleClose();
      return;
    }

    if (!selectedWorkshop) {
      setShowErrorAlert(true);
      setErrorAlertMessage(`Select a workshop to register to.`);
      handleClose();
      return;
    }

    setSelectedValue(userId);

    try {
      if ((selectedWorkshopDetails as any).participation === 'C') {
        await signinToWorkshop((selectedWorkshopDetails as any).id, {
          participation: 'R'
        });
        showAlert(
          `${attendee.first_name} ${attendee.last_name}'s check-in has been removed.`
        );
      } else {
        await signinToWorkshop((selectedWorkshopDetails as any).id, {
          participation: 'C'
        });
        showAlert(
          `${attendee.first_name} ${attendee.last_name} has been checked in.`
        );
      }
    } catch {
      setShowErrorAlert(true);
      setErrorAlertMessage(`An error occured. Please try again.`);
    } finally {
      fetchMyWorkshopData();
      fetchWorkshops();
    }

    handleClose();
  };

  const showAlert = (message: string) => {
    setCheckedInAttendee(message);
    setShowSuccessAlert(true);
  };

  const getParticipationClassName = (code: string) => {
    switch (code) {
      case 'P':
        return 'Hacker';
      case 'M':
        return 'Mentor';
      case 'J':
        return 'Judge';
      case 'S':
        return 'Sponsor';
      case 'V':
        return 'Volunteer';
      case 'O':
        return 'Organizer';
      case 'G':
        return 'Guardian';
      case 'E':
        return 'Media';
      default:
        return '';
    }
  };

  const handleWorkshopChange = (selectedOption: any) => {
    setSelectedWorkshop(selectedOption);
  };

  const renderWorkshops = () => {
    return myWorkshops.map(workshop => {
      const workshopDetails = workshops.find(
        (w: any) => w.id === (workshop as { workshop: string }).workshop
      );
      if (workshopDetails) {
        const parts = workshopDetails.name
          .split('-')
          .map((part: any) => part.trim());
        const displayName = parts.slice(3).join(' - ');
        return (
          <li
            key={(workshop as { id: string })?.id}
            className="flex items-center gap-2"
          >
            {displayName}
            {workshop &&
              (workshop as { participation: string }).participation === 'C' && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  className="w-4 h-4"
                >
                  <path
                    fill="#43a047"
                    d="M32 2C15.431 2 2 15.432 2 32c0 16.568 13.432 30 30 30 16.568 0 30-13.432 30-30C62 15.432 48.568 2 32 2zm-6.975 48-.02-.02-.017.02L11 35.6l7.029-7.164 6.977 7.184 21-21.619L53 21.199 25.025 50z"
                  />
                </svg>
              )}
          </li>
        );
      }
      return null;
    });
  };

  return (
    <div className="h-screen p-6">
      {status === 'authenticated' && (
        <>
          <h1 className="mb-16 text-2xl">Workshop Checkin</h1>
          <hr className="mb-6" />
          <span className="pb-6 text-lg font-medium">
            Search Registered Workshops
          </span>
          <div className="grid gap-4 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
            <div className="p-4 max-w-[366px] min-h-[156px] bg-[#F4F4F4] rounded mx-auto sm:mx-0">
              <div className="mb-6">
                <span>Select Workshop:</span>
                <CustomSelect
                  label="Select Workshop"
                  options={workshopOptions}
                  value={selectedWorkshop}
                  onChange={handleWorkshopChange}
                  search={true}
                />
              </div>
              <div className="flex">
                <div className="mb-6">
                  <span>Attendee:</span>
                  <CustomSelect
                    label="Search by"
                    options={selectOptions}
                    value={selectedValue}
                    onChange={handleSelectChange}
                    search={true}
                  />
                </div>
                <button onClick={handleOpen}>
                  <img
                    src="/icons/dashboard/qr.svg"
                    alt="scan QR code"
                    className="mb-3 ml-3 "
                  />
                </button>
              </div>
              {selectedValue && attendeeDetails ? (
                <>
                  <div className="flex items-center h-20 gap-2 pl-4 bg-white rounded">
                    {attendeeDetails.checkedInAt && (
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
                      <p>
                        {attendeeDetails.firstName} {attendeeDetails.lastName}
                      </p>
                      <div className="w-fit h-5 px-2 bg-neutral-800 rounded-[5px] flex justify-center items-center text-xs mt-2 text-white">
                        {getParticipationClassName(
                          attendeeDetails.participationClass
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="pt-2">
                    {Array.isArray(myWorkshops) && myWorkshops.length > 0 ? (
                      <ul>{renderWorkshops()}</ul>
                    ) : (
                      <span>
                        Attendee does not have any registered workshops.
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center h-20 gap-2 pl-4 bg-white rounded">
                  <span>Select or scan a user to continue</span>
                </div>
              )}
              {selectedValue && attendeeDetails && selectedWorkshop && (
                <button
                  onClick={() => handleCheckin(selectedValue, true)}
                  className="px-4 py-2 mt-4 ml-auto text-white bg-blue-500 rounded font-xs hover:bg-blue-700"
                >
                  <p className="text-sm">
                    {attendeeDetails.checkedInAt
                      ? 'Remove Check In'
                      : 'Check In to Workshop'}
                  </p>
                </button>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center justify-center gap-4">
                <div className="flex flex-col items-center px-4 py-2 w-36 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
                  <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
                    Registered
                  </span>
                  <span className="text-2xl font-semibold text-black text-opacity-90">
                    {
                      attendedWorkshops.filter(
                        workshop =>
                          (workshop as any).workshop === selectedWorkshop
                      ).length
                    }
                  </span>
                </div>
                <div className="flex flex-col items-center px-4 py-2 w-36 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
                  <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
                    Checked In
                  </span>
                  <span className="text-2xl font-semibold text-black text-opacity-90">
                    {
                      attendedWorkshops.filter(
                        workshop =>
                          (workshop as any).workshop === selectedWorkshop &&
                          (workshop as any).participation === 'C'
                      ).length
                    }
                  </span>
                </div>
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
                showSuccessAlert
                  ? 'opacity-100'
                  : 'pointer-events-none opacity-0'
              }`}
            >
              <Alert
                severity="success"
                onClose={() => {
                  setShowSuccessAlert(false);
                }}
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
                onClose={() => {
                  setShowErrorAlert(false);
                }}
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
