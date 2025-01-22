'use client';
import { updateAttendee } from '@/app/api/attendee';
import { useSpecialTracks, Track } from '@/hooks/useSpecialTracks';
import CustomSelectMultipleTyping from '@/components/CustomSelectMultipleTyping';
import { useAuthContext } from '@/hooks/AuthContext';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { SpecialTrackSelect } from '@/components/SpecialTrackSelect';

export default function Interests() {
  const { data: session } = useSession();
  const { user } = useAuthContext();

  const [warning, setWarning] = useState<string>();
  const { tracks, isLoading, error } = useSpecialTracks();

  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [isInterested, setIsInterested] = useState(false);

  useEffect(() => {
    if (user) {
      setSelectedTracks(user.intended_tracks);
      setIsInterested(user.intended_hardware_hack);
    }
  }, [user]);


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
          <SpecialTrackSelect
            selectedTracks={selectedTracks}
            onChange={setSelectedTracks}
            maxSelections={2}
            labelClass="font-semibold"
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
