'use client';
import { updateAttendee } from '@/app/api/attendee';
import { getAvailableTracks } from '@/app/api/teamformation';
import CustomSelectMultipleTyping from '@/components/CustomSelectMultipleTyping';
import { useAuthContext } from '@/hooks/AuthContext';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
interface TrackOption {
  label: string;
  value: string;
}
export default function Interests() {
  const { data: session } = useSession();
  const { user } = useAuthContext();

  const [tracks, setTracks] = useState<TrackOption[] | undefined>(undefined);
  const [warning, setWarning] = useState<string>();

  useEffect(() => {
    if (session) {
      getAvailableTracks(session?.access_token)
        .then(result => {
          if (result) {
            const formattedTracks = result.choices.map(track => {
              return {
                label: track.display_name,
                value: track.value
              };
            });
            setTracks(formattedTracks);
          }
        })
        .catch(error => console.error(error.message));
    }
  }, []);

  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [isInterested, setIsInterested] = useState(false);

  useEffect(() => {
    if (user) {
      setSelectedTracks(user.intended_tracks);
      setIsInterested(user.intended_hardware_hack);
    }
  }, [user]);

  function handleSelection(value: string[]) {
    if (value.length > 2) {
      setWarning('Please Select ONLY 2 Tracks');
      setTimeout(() => setWarning(''), 5000);
    } else {
      setWarning('');
      if (value !== selectedTracks) {
        setSelectedTracks(value);
      }
    }
  }

  const handleSubmit = () => {
    if (session) {
      updateAttendee(session?.access_token, {
        id: user?.id,
        intended_tracks: selectedTracks,
        intended_hardware_hack: isInterested
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 ">
      <div className="text-blue-400 font-semibold text-2xl">MY INTERESTS</div>
      {!tracks ? (
        'Loading...'
      ) : (
        <div className="flex flex-col gap-2">
          <div className="font-semibold">PURPOSE TRACKS (Select. 2)</div>
          <div className="text-lg text-red-400">{warning}</div>
          <CustomSelectMultipleTyping
            width="100%"
            label="Select a status"
            options={tracks || []}
            value={selectedTracks}
            onChange={handleSelection}
          />
          <div className="flex flex-row gap-2  items-center">
            <input
              className="transform scale-150" // Use Tailwind CSS classes to make it bigger
              type="checkbox"
              checked={isInterested}
              onChange={() => setIsInterested(!isInterested)} // Toggle the state on checkbox change
            ></input>
            <div className="text-2xl text-blue-400">
              Do you want hardware hack?
            </div>
          </div>
          <div className="flex flex-row justify-start ">
            <button
              className="transition-all mb-auto hover:opacity-60 mt-4 bg-[#4D97E8] hover:bg-[#4589d2] px-7 py-2 rounded-full text-white align-self-start"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <div className="text-2xl">Track Descriptions</div>
            <TrackInfo
              descriptionLink={
                'https://rhack.notion.site/Future-Constructors-459c4a06a26f4310989b2db4c3c11543'
              }
              trackName={'Future Constructors'}
            />
            <TrackInfo
              descriptionLink={
                'https://rhack.notion.site/Enhanced-Learning-df7d5cf89c624f11af76b0e763f5c90f'
              }
              trackName={'Enhanced Learning'}
            />
            <TrackInfo
              descriptionLink={
                'https://rhack.notion.site/Vitality-Unleashed-Health-e75bea3ea4da44beab113d9bc193476a'
              }
              trackName={'Vitality Unleashed (Health)'}
            />
            <TrackInfo
              descriptionLink={
                'https://rhack.notion.site/Living-Harmony-Smart-Cities-and-Sustainability-20956cfb8fa5434d9977c502f2d9037c'
              }
              trackName={'Living Harmony (Smart Cities and Sustainability)'}
            />
            <TrackInfo
              descriptionLink={
                'https://rhack.notion.site/Community-Hack-ad93d567ace04c3287cf877e4e78a35c'
              }
              trackName={'Community Hack'}
            />
            <TrackInfo
              descriptionLink={
                'https://rhack.notion.site/Augmented-Productivity-28acad21173a484d9be9f59b5a79fb74'
              }
              trackName={'Augmented Productivity (Work)'}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function TrackInfo({
  descriptionLink,
  trackName
}: {
  descriptionLink: string;
  trackName: string;
}) {
  return (
    <a href={descriptionLink} target="_blank" className="text-blue-400">
      {trackName}
    </a>
  );
}
