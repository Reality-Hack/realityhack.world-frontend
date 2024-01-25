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
import { useAuthContext } from '@/hooks/AuthContext';
import React, { MouseEventHandler, useEffect, useState } from 'react';
import CustomDialog from './Dialogue';
import QRCodeReader from '@/components/admin/QRCodeReader';
import { getAvailableTracks } from '@/app/api/teamformation';
import { LinearProgress } from '@mui/material';

interface Attendee {
  participation_class?: string;
  first_name: string;
  last_name: string;
  id: string;
}
interface Preference {
  id: string;
  preference: 'Y' | 'N';
  preferee: string;
  preferer: string;
}
interface PreferenceInput {
  preference: 'Y' | 'N';
  preferee: string;
  preferer: string;
}

export default function HackersMet({}) {
  const { data: session } = useSession();
  const { user } = useAuthContext();

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
    if (session?.access_token) {
      setAttendeesLoading(true);
      getAllAttendees(session.access_token)
        .then(apps => {
          // Filter attendees with participation class "P"
          const filteredAttendees = apps.filter(
            (attendees: any) =>
              (attendees.participation_class === 'P' ||
              typeof attendees.participation_class === 'undefined') &&
              attendees.id != user?.id
          );
          setAttendeeInfo(filteredAttendees);
        })
        .catch(error => {
          // Handle error if necessary
          console.error('Error fetching attendees:', error);
        }).finally(() => setAttendeesLoading(false));
    }
  }, [session]);

  useEffect(() => {
    if (session && user) {
      setPreferencesLoading(true);
      getPreferencesByAttendeeId(session.access_token, user.id)
        .then(prefs => {
          setPersonalPreferences(prefs);
          console.log(prefs, 'prefs');
        })
        .catch(error => {
          // Handle error if necessary
          console.error('Error fetching attendees:', error);
        }).finally(() => setPreferencesLoading(false));
    }
  }, [session, user]);

  async function addPreferences(preferee: string, preferenceStatus: 'Y' | 'N') {
    //HOW DO I GET THE ATTENDEE ID
    if (session) {
      const pref: PreferenceInput = {
        preference: preferenceStatus,
        preferer: user?.id,
        preferee: preferee
      };
      const retrievedPref = await addPreference(session?.access_token, pref);
      console.log(retrievedPref);
      setPersonalPreferences(prev => [...prev, retrievedPref]); // Remove the trailing comma here
    }
  }

  async function deletePreferences(preferenceId: string) {
    if (session) {
      setPreferencesLoading(true);
      await deletePreference(session?.access_token, preferenceId);
      let oldPrefIdx = personalPreferences.findIndex(
        el => el.id === preferenceId
      );
      let newPrefList = personalPreferences.slice();
      newPrefList.splice(oldPrefIdx, 1);
      setPersonalPreferences(newPrefList);
      setPreferencesLoading(false);
    }
  }

  async function updatePreferences(
    preference: 'Y' | 'N',
    preferenceId: string
  ) {
    if (session) {
      setPreferencesLoading(true);
      await updatePreference(session?.access_token, preferenceId, preference);
      let oldPrefIdx = personalPreferences.findIndex(
        el => el.id === preferenceId
      );
      let newPrefList = personalPreferences.slice();
      if (oldPrefIdx != -1) {
        newPrefList[oldPrefIdx].preference = preference;
      }
      setPersonalPreferences(newPrefList);
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
    <div className='flex flex-col gap-2'>
      <div className="flex flex-wrap items-center justify-center">
        <div className="text-blue-400 text-3xl">{`Hackers I've Met`}</div>
        <button className='ml-auto p-2 rounded-lg bg-blue-300 text-white hover:opacity-60 drop-shadow-lg'
        onClick={handleOpenDialog} disabled={!(attendeesLoading || preferencesLoading)}>My Personal Contacts</button>{' '}
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
        {attendeesLoading || preferencesLoading ? <LinearProgress /> : personalPreferences &&
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
          ))}

        {/* CustomDialog component with children */}
        <CustomDialog
          open={openDialog}
          onClose={handleCloseDialog}
          title="All Preferences"
        >
          {/* Dialog content goes here */}
          {personalPreferences &&
            attendees &&
            personalPreferences.map((pref: Preference, index: number) => (
              <ModalPersonRow
                key={index}
                id={pref.id}
                preferee={attendees.find(el => el.id == pref.preferee)}
                status={pref.preference}
                // Pass your other functions or event handlers if needed
                // updateInfo={(preference, name) => updateInfo(preference, name)}
                deletePref={() => {
                  if (!pref.id) return;
                  deletePreferences(pref.id);
                }}
                updatePref={updatePreferences}
              />
            ))}{' '}
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
        <div onClick={()=>deletePref(id)} className="bg-white text-black border-2 p-2 rounded-lg hover:cursor-pointer hover:opacity-60">
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

  return (
    <div className={`flex flex-row pb-2 my-2 border-b-2 border-black`}>
      <div className="flex flex-row mr-auto gap-2 items-center">
        {/* <img src={"profilePicSrc"} width={20} height={20} alt="person" /> */}
        <div className='flex flex-col'>
          <div className="text-lg font-semibold">{`${preferee.first_name} ${preferee.last_name}`}</div>
          <div className={`${status=="Y"?`text-green-600`:`text-red-400`}`}>{status == 'Y' ? 'Favorite' : 'Block'}</div>

        </div>
      
      </div>
      <div className="flex flex-col ml-auto gap-2">
        <div
          className={`${
            status === 'Y' ? 'text-green-600' : 'text-red-400'
          } p-2 rounded-lg text-white text-center`}
        >
        </div>
        <div
          onClick={() => updatePref(status == 'Y' ? 'N' : 'Y', id)}
          className={`${status=="Y"?`bg-red-400`:`bg-green-600`} text-white text-center drop-shadow-lg p-2 rounded-lg hover:cursor-pointer`}
        >
           {status == 'Y' ? 'Block' : 'Favorite'}
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
  addToPreferences: (preferee: string, preferenceStatus: 'Y' | 'N') => void;
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
  // const { user } = useAuthContext();
  const [fellowAttendee, setFellowAttendee] = useState('');

  function handleAttendeeSelection(value: string) {
    setFellowAttendee(value);
  }

  function handlePreferenceSelection(preference: 'Y' | 'N') {
    addToPreferences(fellowAttendee, preference);
    setFellowAttendee('');
  }

  return (
    <div>
      {enabled ? <><div className="flex flex-row gap-2 items-center">
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
            onClick={() => handlePreferenceSelection('Y')}
            className={`bg-green-500 text-white ${
              fellowAttendee === ''
                ? `cursor-not-allowed`
                : `hover:cursor-pointer hover:opacity-60`
            }
               p-2 h-10 rounded-lg w-24 md:w-32 text-center drop-shadow-lg`}
          >
            Yay
          </div>
          <div
            onClick={() => handlePreferenceSelection('N')}
            className={`bg-red-500 text-white  ${
              fellowAttendee === ''
                ? `cursor-not-allowed`
                : `hover:cursor-pointer hover:opacity-60`
            }
             p-2 h-10 rounded-lg w-24 md:w-32 text-center drop-shadow-`}
          >
            Nay
          </div>
        </div>
      </div>
      <div className={`flex flex-row pb-2 my-2 border-b-2`}>
        <div className="flex flex-row mr-auto gap-2 items-center">
          {/* <img src={profilePicSrc} width={20} height={20} alt="person" /> */}
          <div className="text-lg font-semibold">{name}</div>
        </div>
      </div></> : "Loading..."}
    </div>
  );
}
