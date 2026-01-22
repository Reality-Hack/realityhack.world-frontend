'use client';
import CustomSelectTyping from '@/components/CustomSelectTyping';
import { useAuth } from '@/contexts/AuthContext';
import React, { useMemo, useState } from 'react';
import CustomDialog from './Dialogue';
import { LinearProgress } from '@mui/material';
import { toast } from 'sonner';
import './Styles.css';
import { useEventParticipants } from '@/contexts/EventParticipantsContext';
import { AttendeeName, AttendeePreference, PreferenceEnum } from '@/types/models';
import {
  useAttendeepreferencesList,
  attendeepreferencesCreate,
  attendeepreferencesPartialUpdate,
  attendeepreferencesDestroy,
  getAttendeepreferencesListKey
} from '@/types/endpoints';
import { useSWRConfig } from 'swr';
import { useSession } from 'next-auth/react';

// Type for connection profile data
interface ConnectionProfile {
  id: string;
  preferenceId: string;
  name: string;
  email: string;
  participationClass: string;
  participationRole: string | null;
  discord: string;
  preference: PreferenceEnum;
  teamName: string | null;
}

// Reusable ConnectionCard component
function ConnectionCard({ connection }: { connection: ConnectionProfile }) {
  const preferenceLabel = connection.preference === PreferenceEnum.Y 
    ? 'Preferred' 
    : connection.preference === PreferenceEnum.N 
      ? 'Excluded' 
      : 'Connected';
  const preferenceColor = connection.preference === PreferenceEnum.Y 
    ? 'text-green-600 bg-green-50' 
    : connection.preference === PreferenceEnum.N 
      ? 'text-red-600 bg-red-50' 
      : 'text-gray-600 bg-gray-50';

  return (
    <div className="w-full p-4 border border-gray-300 rounded-md shadow-sm bg-white">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">
            {connection.name}
          </h3>
          <p className="text-gray-600 text-sm">
            {connection.participationClass}
            {connection.participationRole && (
              <span className="text-blue-600 ml-2">• {connection.participationRole}</span>
            )}
          </p>
          {connection.email && (
            <p className="text-gray-500 text-xs mt-1">
              {connection.email}
            </p>
          )}
          {connection.discord && (
            <p className="text-indigo-500 text-xs mt-1">
              Discord: {connection.discord}
            </p>
          )}
          {connection.teamName ? (
            <p className="text-orange-600 text-xs mt-1 font-medium">
              Team: {connection.teamName}
            </p>
          ) : (
            <p className="text-green-600 text-xs mt-1">
              Looking for a team
            </p>
          )}
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${preferenceColor}`}>
          {preferenceLabel}
        </span>
      </div>
    </div>
  );
}

export default function HackersMet() {
  const { data: session } = useSession();
  const { user } = useAuth();
  const { rsvpByAttendeeId, rsvpAttendees, isLoadingRsvps, choiceMaps, teamByAttendeeId } = useEventParticipants();
  const { mutate } = useSWRConfig();

  const requestConfig = useMemo(() => ({
    swr: { enabled: !!session?.access_token && !!user?.id },
    request: {
      headers: { 'Authorization': `JWT ${session?.access_token}` }
    }
  }), [session?.access_token, user?.id]);
  
  const { data: preferences, isLoading: isLoadingPreferences } = useAttendeepreferencesList(
    { preferer: user?.id },
    requestConfig
  );

  const [openDialog, setOpenDialog] = useState(false);

  // Derive available attendee options from rsvpAttendees and preferences
  const availableAttendeeOptions = useMemo(() => {
    if (!rsvpAttendees || !preferences) return [];
    return rsvpAttendees
      .filter(attendee => 
        attendee.id !== user?.id && 
        !preferences.some(pref => pref.preferee === attendee.id)
      )
      .map(attendee => ({
        label: `${attendee.first_name || ''} ${attendee.last_name || ''}`.trim(),
        value: attendee.id || ''
      }));
  }, [rsvpAttendees, preferences, user?.id]);

  // Derive connections for the dialog
  const connections = useMemo(() => {
    if (!preferences) return [];
    return preferences.map(preference => {
      const rsvp = rsvpByAttendeeId(preference.preferee);
      const attendee = rsvp?.attendee;
      const application = rsvp?.application;
      const participationClassCode = rsvp?.participation_class || '';
      const participationClassLabel = choiceMaps.participationClass[participationClassCode] || participationClassCode || 'Unknown';
      const participationRoleCode = application?.participation_role ? application.participation_role : rsvp?.participation_role || '';
      const participationRoleLabel = participationRoleCode 
        ? (choiceMaps.participationRole[participationRoleCode] || participationRoleCode)
        : null;
      const team = teamByAttendeeId(preference.preferee);
      
      return {
        id: preference.id || '',
        preferenceId: preference.id || '',
        name: attendee ? `${attendee.first_name || ''} ${attendee.last_name || ''}`.trim() : '',
        email: attendee?.email || '',
        participationClass: participationClassLabel,
        participationRole: participationRoleLabel,
        discord: rsvp?.communication_platform_username || '',
        preference: preference.preference,
        teamName: team?.name || null,
      };
    });
  }, [preferences, rsvpByAttendeeId, choiceMaps.participationClass, choiceMaps.participationRole, teamByAttendeeId]);

  // Revalidate preferences list after mutations
  const revalidatePreferences = () => {
    mutate(getAttendeepreferencesListKey({ preferer: user?.id }));
  };

  const authHeaders = useMemo(() => ({
    headers: { 'Authorization': `JWT ${session?.access_token}` }
  }), [session?.access_token]);

  async function addPreferences(preferee: string, preferenceStatus: PreferenceEnum) {
    const userId = user?.id;
    const eventId = user?.event_rsvp?.event;

    if (!userId || !eventId || !session?.access_token) {
      toast.error('User or session information missing.');
      return;
    }

    try {
      await attendeepreferencesCreate({
        preference: preferenceStatus,
        preferer: userId,
        preferee: preferee,
        event: eventId
      }, authHeaders);
      revalidatePreferences();
      toast.success('Connection added!');
    } catch (error: unknown) {
      console.error('Error adding preference:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Failed to add connection: ' + message);
    }
  }

  async function deletePreferences(preferenceId: string) {
    if (!session?.access_token) {
      toast.error('Session information missing.');
      return;
    }

    try {
      await attendeepreferencesDestroy(preferenceId, authHeaders);
      revalidatePreferences();
      toast.success('Connection removed.');
    } catch (error: unknown) {
      console.error('Error deleting preference:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Failed to remove connection: ' + message);
    }
  }

  async function updatePreferences(preference: PreferenceEnum, preferenceId: string) {
    if (!session?.access_token) {
      toast.error('Session information missing.');
      return;
    }

    try {
      await attendeepreferencesPartialUpdate(preferenceId, { preference }, authHeaders);
      revalidatePreferences();
      toast.success('Connection updated!');
    } catch (error: unknown) {
      console.error('Error updating preference:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Failed to update connection: ' + message);
    }
  }

  const isLoading = isLoadingRsvps || isLoadingPreferences;

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
          disabled={isLoading}
        >
          Connection Profiles
        </button>
      </div>

      <PreferenceRowForm
        options={availableAttendeeOptions}
        addToPreferences={addPreferences}
        enabled={!isLoading}
      />
      <div>
        {isLoading ? (
          <LinearProgress />
        ) : (
          connections.map((connection) => (
            <PersonRow
              key={connection.id}
              connection={connection}
              deletePref={() => {
                if (!connection.preferenceId) return;
                deletePreferences(connection.preferenceId);
              }}
            />
          ))
        )}

        {/* CustomDialog component with children */}
        <CustomDialog open={openDialog} onClose={handleCloseDialog}>
          <div className="container-fluid bg-[#F3F4F6]">
            <div className="p-8 pb-10 m-0">
              <h2 className="text-2xl font-bold mb-4">Team Formation Preferences</h2>
              <input
                type="text"
                placeholder="Search connections..."
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />
              {isLoadingPreferences ? (
                <LinearProgress />
              ) : connections.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No connections yet. Start connecting with other hackers!</p>
              ) : (
                <div className="space-y-3">
                  {connections.map((connection) => (
                    <ConnectionCard key={connection.id} connection={connection} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </CustomDialog>
      </div>
    </div>
  );
}

interface PersonRowProps {
  connection: ConnectionProfile;
  deletePref: () => void;
}

function PersonRow({ connection, deletePref }: PersonRowProps) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <div className="flex flex-row pb-2 my-2 border-b-2 border-black">
        <div className="flex flex-row mr-auto gap-2 items-center">
          <div
            onClick={deletePref}
            className="bg-white text-black border-2 p-2 rounded-lg hover:cursor-pointer hover:opacity-60"
          >
            Forget
          </div>
          <div 
            className="text-lg font-semibold hover:text-blue-600 hover:underline cursor-pointer"
            onClick={() => setShowProfile(true)}
          >
            {connection.name}
          </div>
        </div>
      </div>
      <CustomDialog open={showProfile} onClose={() => setShowProfile(false)}>
        <div className="p-4">
          <ConnectionCard connection={connection} />
        </div>
      </CustomDialog>
    </>
  );
}
interface ModalPersonRowProps {
  preferee?: AttendeeName;
  status: PreferenceEnum;
  deletePref: () => void;
  updatePref: (preference: PreferenceEnum, preferenceId: string) => void;
  id: string;
}

function ModalPersonRow({
  preferee,
  status,
  deletePref,
  updatePref,
  id
}: ModalPersonRowProps) {
  if (!preferee) return null;

  const getConnectionRowValues = () => {
    if (status === PreferenceEnum.T) {
      return { textColor: 'text-gray-500', statusText: 'Connected' };
    } else if (status === PreferenceEnum.Y) {
      return { textColor: 'text-green-600', statusText: 'Preferred' };
    } else {
      return { textColor: 'text-red-400', statusText: 'Excluded' };
    }
  };

  const { textColor, statusText } = getConnectionRowValues();

  return (
    <div className="flex flex-row pb-2 my-2 border-b-2 border-black">
      <div className="flex flex-row mr-auto gap-2 items-center">
        <div className="flex flex-col">
          <div className="text-lg font-semibold">{`${preferee.first_name || ''} ${preferee.last_name || ''}`}</div>
          <div className={`${textColor} text-center drop-shadow-lg p-2 rounded-lg`}>
            {statusText}
          </div>
        </div>
      </div>
      <div className="flex flex-col ml-auto gap-2">
        <div
          onClick={() => updatePref(PreferenceEnum.Y, id)}
          className="bg-green-500 text-white text-center drop-shadow-lg p-2 rounded-lg hover:cursor-pointer"
        >
          Favorite
        </div>
        <div
          onClick={() => updatePref(PreferenceEnum.N, id)}
          className="bg-red-500 text-white text-center drop-shadow-lg p-2 rounded-lg hover:cursor-pointer"
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
interface PreferenceFormRowProps {
  options: { label: string; value: string }[];
  addToPreferences: (preferee: string, preferenceStatus: PreferenceEnum) => void;
  enabled: boolean;
}

function PreferenceRowForm({
  options,
  addToPreferences,
  enabled
}: PreferenceFormRowProps) {
  const [fellowAttendee, setFellowAttendee] = useState('');

  function handleAttendeeSelection(value: string) {
    setFellowAttendee(value);
  }

  function handlePreferenceSelection(preference: PreferenceEnum) {
    if (!fellowAttendee) return;
    addToPreferences(fellowAttendee, preference);
    setFellowAttendee('');
  }

  if (!enabled) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-row gap-2 items-center">
      <CustomSelectTyping
        width="100%"
        label="Select an attendee"
        options={options}
        value={fellowAttendee}
        onChange={handleAttendeeSelection}
      />
      <div className="flex flex-col md:flex-row ml-auto gap-2">
        <div
          onClick={() => handlePreferenceSelection(PreferenceEnum.T)}
          className={`text-white ${
            fellowAttendee === ''
              ? 'cursor-not-allowed bg-gray-500'
              : 'hover:cursor-pointer hover:opacity-60 bg-green-500'
          } p-2 h-10 rounded-lg w-24 md:w-32 text-center drop-shadow-lg`}
        >
          Connect
        </div>
      </div>
    </div>
  );
}
