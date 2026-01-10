'use client';
import { getAllAttendees } from '@/app/api/attendee';
import {
  getPreferencesByAttendeeId,
  addPreference,
  updatePreference,
  deletePreference
} from '@/app/api/preferences';
import CustomSelectTyping from '@/components/CustomSelectTyping';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/contexts/AuthContext';
import React, { MouseEventHandler, useEffect, useState } from 'react';
import CustomDialog from './Dialogue';
import QRCodeReader from '@/components/admin/QRCodeReader';
import { getAvailableTracks } from '@/app/api/teamformation';
import { LinearProgress } from '@mui/material';
import { FaStar, FaShieldAlt, FaRocket } from 'react-icons/fa';
import { toast } from 'sonner';
import './Styles.css';

interface Connection {
  name: string;
  role: string;
  date: JSX.Element;
  icon?: JSX.Element;
}

interface Attendee {
  participation_class?: string;
  first_name: string;
  last_name: string;
  id: string;
}
interface Preference {
  id: string;
  preference: 'Y' | 'N' | 'T';
  preferee: string;
  preferer: string;
}
interface PreferenceInput {
  preference: 'Y' | 'N' | 'T';
  preferee: string;
  preferer: string;
}

export default function HackersMet({}) {
  const { data: session } = useSession();
  const { user } = useAuth();

  const connections: Connection[] = [
    {
      name: 'Alice Johnson',
      role: 'Software Engineer at TechCorp',
      date: (
        <div className="inline-flex items-top gap-2 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>
          <span>2023-05-15</span>
        </div>
      ),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="#EBB818"
          style={{ width: '24px', height: '24px', display: 'block' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>
      )
    },
    {
      name: 'Bob Smith',
      role: 'Startup Founder, interested in AI',
      date: (
        <div className="inline-flex items-top gap-2 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>
          <span>2023-06-02</span>
        </div>
      ),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="#35CA6C"
          style={{ width: '24px', height: '24px', display: 'block' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
          />
        </svg>
      )
    },
    {
      name: 'Charlie Brown',
      role: 'Marketing Specialist',
      date: (
        <div className="inline-flex items-top gap-2 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>
          <span>2023-06-20</span>
        </div>
      ),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="#F69494"
          style={{ width: '22px', height: '22px', display: 'block' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21.85a2 2 0 0 1-1-.25l-.3-.17A15.17 15.17 0 0 1 3 8.23v-.14a2 2 0 0 1 1-1.75l7-3.94a2 2 0 0 1 2 0l7 3.94a2 2 0 0 1 1 1.75v.14a15.17 15.17 0 0 1-7.72 13.2l-.3.17a2 2 0 0 1-.98.25m0-17.7L5 8.09v.14a13.15 13.15 0 0 0 6.7 11.45l.3.17l.3-.17A13.15 13.15 0 0 0 19 8.23v-.14Z"
          />
        </svg>
      )
    },
    {
      name: 'Diana Prince',
      role: 'Data Scientist, expert in machine learning',
      date: (
        <div className="inline-flex items-top gap-2 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>
          <span>2023-07-10</span>
        </div>
      ),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="#EBB818"
          style={{ width: '24px', height: '24px', display: 'block' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>
      )
    },
    {
      name: 'Ethan Hunt',
      role: 'UX Designer with 5 years of experience',
      date: (
        <div className="inline-flex items-top gap-2 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>
          <span>2023-07-25</span>
        </div>
      ),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="#35CA6C"
          style={{ width: '24px', height: '24px', display: 'block' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
          />
        </svg>
      )
    }
  ];
  const [attendeesLoading, setAttendeesLoading] = useState(false);
  const [preferencesLoading, setPreferencesLoading] = useState(false);

  const [attendees, setAttendeeInfo] = useState<Attendee[]>();
  const [personalPreferences, setPersonalPreferences] = useState<Preference[]>(
    []
  );
  const [newPreference, setNewPreference] = useState<Preference>();
  const [availableAttendeeOptions, setAvailableAttendeeOptions] = useState<
    { label: string; value: string }[] | undefined
  >(undefined);

  useEffect(() => {
    const token = session?.access_token;
    const userId = user?.id;

    if (!token) return;

    setAttendeesLoading(true);
    getAllAttendees(token)
      .then(apps => {
        // Filter attendees with participation class "P"
        const filteredAttendees = apps.filter(
          (attendee: any) =>
            (attendee.participation_class === 'P' ||
              typeof attendee.participation_class === 'undefined') &&
            attendee.id !== userId
        );
        setAttendeeInfo(filteredAttendees);
      })
      .catch(error => {
        console.error('Error fetching attendees:', error);
        toast.error('Failed to load attendees.');
      })
      .finally(() => setAttendeesLoading(false));
  }, [session, user?.id]);

  useEffect(() => {
    const token = session?.access_token;
    const userId = user?.id;

    if (!token || !userId) return;

    setPreferencesLoading(true);
    getPreferencesByAttendeeId(token, userId)
      .then(prefs => {
        setPersonalPreferences(prefs);
      })
      .catch(error => {
        console.error('Error fetching preferences:', error);
        toast.error('Failed to load your connections.');
      })
      .finally(() => setPreferencesLoading(false));
  }, [session, user?.id]);

  async function addPreferences(
    preferee: string,
    preferenceStatus: 'Y' | 'N' | 'T'
  ) {
    const token = session?.access_token;
    const userId = user?.id;

    if (!token || !userId) {
      toast.error('Session or User information missing.');
      return;
    }

    try {
      const pref: PreferenceInput = {
        preference: preferenceStatus,
        preferer: userId,
        preferee: preferee
      };
      const retrievedPref = await addPreference(token, pref);
      setPersonalPreferences(prev => [...prev, retrievedPref]);
      toast.success('Connection added!');
    } catch (error: any) {
      console.error('Error adding preference:', error);
      toast.error('Failed to add connection: ' + error.message);
    }
  }

  async function deletePreferences(preferenceId: string) {
    const token = session?.access_token;
    if (!token) return;

    try {
      setPreferencesLoading(true);
      await deletePreference(token, preferenceId);
      setPersonalPreferences(prev => prev.filter(p => p.id !== preferenceId));
      toast.success('Connection removed.');
    } catch (error: any) {
      console.error('Error deleting preference:', error);
      toast.error('Failed to remove connection: ' + error.message);
    } finally {
      setPreferencesLoading(false);
    }
  }

  async function updatePreferences(
    preference: 'Y' | 'N',
    preferenceId: string
  ) {
    const token = session?.access_token;
    if (!token) return;

    try {
      setPreferencesLoading(true);
      await updatePreference(token, preferenceId, preference);
      setPersonalPreferences(prev => 
        prev.map(p => p.id === preferenceId ? { ...p, preference } : p)
      );
      toast.success('Connection updated!');
    } catch (error: any) {
      console.error('Error updating preference:', error);
      toast.error('Failed to update connection: ' + error.message);
    } finally {
      setPreferencesLoading(false);
    }
  }

  //need useEffect to get people's preferences

  //this function formats the attendee options ased off api attendee collection
  useEffect(() => {
    const filteredHackerOptions =
      attendees?.filter((attendee: Attendee) => {
        // Check if the attendee's id is not the user's id and not present in personalPreferences
        const isUser = attendee.id === user?.id;
        const isPresentInPrefs = personalPreferences?.some(
          (pref: Preference) => pref.preferee === attendee.id
        );
        return !isUser && !isPresentInPrefs;
      }) || [];

    // making the labels for the options
    const hackerOptions =
      filteredHackerOptions.map((attendee: Attendee) => ({
        label: `${attendee.first_name} ${attendee.last_name}`,
        value: attendee.id
      })) || [];

    setAvailableAttendeeOptions(hackerOptions);
  }, [personalPreferences, attendees]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-center">
        <div className="text-blue-400 text-3xl">{`Hackers I've Met`}</div>
        <button
          className="ml-auto p-2 rounded-lg bg-blue-300 text-white hover:opacity-60 drop-shadow-lg"
          onClick={handleOpenDialog}
          disabled={attendeesLoading || preferencesLoading}
        >
          Team Formation Preferences
        </button>{' '}
      </div>

      <PreferenceRowForm
        name={newPreference?.preferee}
        // status={newPreference.status}
        status={newPreference?.preference}
        profilePicSrc={'newPreference.src'}
        options={availableAttendeeOptions || []}
        addToPreferences={addPreferences}
        enabled={!attendeesLoading}
      />
      <div>
        {attendeesLoading || preferencesLoading ? (
          <LinearProgress />
        ) : (
          personalPreferences &&
          attendees &&
          personalPreferences.map((pref: Preference, index: number) => (
            <PersonRow
              key={index}
              id={pref.id}
              preferee={attendees.find(el => el.id == pref.preferee)}
              status={pref.preference}
              // Pass your other functions or event handlers if needed
              deletePref={() => {
                if (!pref.id) return;
                deletePreferences(pref.id);
              }}
            />
          ))
        )}

        {/* CustomDialog component with children */}
        <CustomDialog open={openDialog} onClose={handleCloseDialog}>
          {/* Dialog content goes here */}
          {personalPreferences && attendees && (
            <div className="container-fluid bg-[#F3F4F6]">

              {/* Display the preference value */}
              <div className="p-8 pb-10 m-0 ">
                <h2 className="text-2xl font-bold mb-4">Past Connections</h2>
                <input
                  type="text"
                  placeholder="Search connections..."
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                />
                <div className="space-y-4 ">
                  {connections.map((connection, index) => (
                    <div
                      key={index}
                      className="w-full p-3 pb-0 pt-2 border border-gray-300 rounded-md shadow-sm bg-white"
                    >
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-lg font-semibold mb-1 mt-2">
                            {connection.name}
                          </h3>
                          <div className="mt-2">{connection.icon}</div>
                        </div>

                        <p className="text-gray-600 text-sm mb-1">
                          {connection.role}
                        </p>
                        <p className="text-gray-500 text-sm mb-1">
                          {connection.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CustomDialog>
      </div>
    </div>
  );
}

interface PersonRowProps {
  preferee?: Attendee;
  status: string;
  deletePref: (preferenceId: string) => void;
  id: string;
}

function PersonRow({ preferee, id, deletePref }: PersonRowProps) {
  if (!preferee) return <></>;

  return (
    <div className={`flex flex-row pb-2 my-2 border-b-2 border-black`}>
      <div className="flex flex-row mr-auto gap-2 items-center">
        {/* <img src={"profilePicSrc"} width={20} height={20} alt="person" /> */}
        <div
          onClick={() => deletePref(id)}
          className="bg-white text-black border-2 p-2 rounded-lg hover:cursor-pointer hover:opacity-60"
        >
          Forget
        </div>
        <div className="text-lg font-semibold">{`${preferee.first_name} ${preferee.last_name}`}</div>
      </div>
    </div>
  );
}
interface ModalPersonRowProps {
  preferee?: Attendee;
  status: string;
  deletePref: () => void;
  updatePref: (preference: 'Y' | 'N', preferenceId: string) => void;
  id: string;
}

function ModalPersonRow({
  preferee,
  status,
  deletePref,
  updatePref,
  id
}: ModalPersonRowProps) {
  if (!preferee) return <></>;
  const connectionRowValues = () => {
    if (status == 'T') {
      return {
        textColor: 'text-gray-500',
        statusText: 'Connected'
      };
    } else if (status == 'Y') {
      return {
        textColor: 'text-green-600',
        statusText: 'Preferred'
      };
    } else {
      return {
        textColor: 'text-red-400',
        statusText: 'Excluded'
      };
    }
  };
  const { textColor, statusText } = connectionRowValues();
  return (
    <div className={`flex flex-row pb-2 my-2 border-b-2 border-black`}>
      <div className="flex flex-row mr-auto gap-2 items-center">
        {/* <img src={"profilePicSrc"} width={20} height={20} alt="person" /> */}
        <div className="flex flex-col">
          <div className="text-lg font-semibold">{`${preferee.first_name} ${preferee.last_name}`}</div>
          <div
            className={`${textColor} text-center drop-shadow-lg p-2 rounded-lg`}
          >
            {statusText}
          </div>
        </div>
      </div>
      <div className="flex flex-col ml-auto gap-2">
        <div
          className={`${textColor} text-center drop-shadow-lg p-2 rounded-lg hover:cursor-pointer`}
        ></div>
        <div
          onClick={() => updatePref('Y', id)}
          className={`bg-green-500 text-white text-center drop-shadow-lg p-2 rounded-lg hover:cursor-pointer`}
        >
          Favorite
        </div>
        <div
          onClick={() => updatePref('N', id)}
          className={`bg-red-500 text-white text-center drop-shadow-lg p-2 rounded-lg hover:cursor-pointer`}
        >
          Exclude
        </div>
        <div
          onClick={deletePref}
          className="text-black border-2 p-2 rounded-lg hover:cursor-pointer hover:opacity-60"
        >
          Forget
        </div>
      </div>
    </div>
  );
}
interface PreferenceFormRow {
  profilePicSrc?: string;
  name?: string;
  src?: string;
  status?: string;
  options: { label: string; value: string }[];
  addToPreferences: (
    preferee: string,
    preferenceStatus: 'Y' | 'N' | 'T'
  ) => void;
  enabled: boolean;
}

function PreferenceRowForm({
  profilePicSrc,
  name,
  status,
  options,
  addToPreferences,
  enabled
}: PreferenceFormRow) {
  // const { user } = useAuth();
  const [fellowAttendee, setFellowAttendee] = useState('');

  function handleAttendeeSelection(value: string) {
    setFellowAttendee(value);
  }

  function handlePreferenceSelection(preference: 'Y' | 'N' | 'T') {
    addToPreferences(fellowAttendee, preference);
    setFellowAttendee('');
  }

  return (
    <div>
      {enabled ? (
        <>
          <div className="flex flex-row gap-2 items-center">
            <CustomSelectTyping
              width="100%"
              label="Select a status"
              options={options}
              value={fellowAttendee}
              onChange={handleAttendeeSelection}
            />

            <div className="flex flex-col md:flex-row ml-auto gap-2">
              {/* <div>
          <QRCodeReader />
        </div> */}
              <div
                onClick={() => handlePreferenceSelection('T')}
                className={`text-white ${
                  fellowAttendee === ''
                    ? `cursor-not-allowed bg-gray-500`
                    : `hover:cursor-pointer hover:opacity-60 bg-green-500`
                }
               p-2 h-10 rounded-lg w-24 md:w-32 text-center drop-shadow-lg`}
              >
                Connect
              </div>
            </div>
          </div>
          <div className={`flex flex-row pb-2 my-2 border-b-2`}>
            <div className="flex flex-row mr-auto gap-2 items-center">
              {/* <img src={profilePicSrc} width={20} height={20} alt="person" /> */}
              <div className="text-lg font-semibold">{name}</div>
            </div>
          </div>
        </>
      ) : (
        'Loading...'
      )}
    </div>
  );
}
