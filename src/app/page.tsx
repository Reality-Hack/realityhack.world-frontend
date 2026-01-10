'use client';
import Dropzone from '@/components/Dropzone';
import Loader from '@/components/Loader';
import Modal from '@/components/Modal';
import QRCodeGenerator from '@/components/dashboard/QRCodeGenerator';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { fileUpload } from './api/application';
import { patchMe } from './api/attendee';

type SetupModalProps = {
  toggleOverlay: () => void;
};

export interface AttendeeData {
  id: string;
  first_name: string;
  last_name: string;
  initial_setup: boolean;
  profile_image?: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const { 
    user,
    isJudge
   } = useAuth();
  const localInitialSetup = localStorage.getItem('initial_setup');
  const [_isOverlayVisible, setOverlayVisible] = useState(false);

  const toggleOverlay = () => {
    setOverlayVisible(prev => !prev);
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

  const WelcomeCopy = useMemo(() => {
    if (isJudge) {
      return (
        <div className="p-6">
          Now that you&apos;ve RSVP&apos;d to Reality Hack 2026, we look forward to seeing you on Sunday, 
          January 25, 2026 for judging day. Judges should plan to arrive on-site at noon and 
          be prepared to stay until 5 or 6pm depending on judging needs. Stay tuned for more 
          comprehensive information from our Judging Leads.
        </div>
      )
    } else {
      return (
      <>
        <div className="p-6">
          Now that you&apos;ve RSVP&apos;d to Reality Hack 2026, make sure you
          join our Discord to start chatting with other accepted
          participants, coordinate housing, share resources, and get to know
          each other! We&apos;ll also be running the event and posting
          announcements through Discord!
        </div>
        <div className="flex justify-center">
          <a
            href="https://discord.gg/XfDXqwTPfv"
            className="mx-auto mt-4 bg-[#4D97E8] px-7 py-2 rounded-full text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join our Discord
          </a>
        </div>
      </>
      )
    }
  }, [isJudge]);
  
  const gettingToTheHackCopy = useMemo(() => {
    if (isJudge) {
      return (
        <div className="p-6">
          Stay tuned for more information on where to report for 
          Judge Orientation from our Judging Leads.
        </div>
      )
    } else {
      return (
      <>
        <div className="p-6">
          We know that a 5-day hackathon event can be overwhelming. If you
          have any questions that you want to know the answers to, feel free
          to ask the organizers on Discord in the #questions-to-organizers
          channel!
        </div>
        <div className="flex justify-center">
          <a
            href="https://discord.gg/XfDXqwTPfv"
            className="mx-auto mt-4 bg-[#4D97E8] px-7 py-2 rounded-full text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join our Discord
          </a>
        </div>
      </>
      )
    }
  }, [isJudge]);
  
  const travelAccomodationsCopy = useMemo(() => {
    if (isJudge) {
      return (
        <>
        Reality Hack at MIT runs from January 22 to 26, 2026.{' '}
        <span className="font-bold">
          However, as a judge, you are only required to attend on Sunday, January 25, 2026.
        </span>{' '}
        Judges should plan to arrive on-site at noon and be prepared to stay until 5 or 6pm depending on judging needs. Stay tuned for more comprehensive information from our Judging Leads. 
        </>
      )
    } else {
      return (
      <>
        <span className="font-bold">
          You should plan to be in Boston on the evening of January 21st
          as we begin at 8am on the 22nd.
        </span>{' '}
        You can also plan to wrap up by around 5pm EST on the 26th.
        We&apos;ll release our full schedule later but you can use our
        guidelines right now to plan travel. <br /> <br />
      </>
      )
    }
  }, [isJudge]);

  function SetupModal({ toggleOverlay }: SetupModalProps) {
    const [acceptedFiles, setAcceptedFiles] = useState<any>(null);
    const [rejectedFiles, setRejectedFiles] = useState<any>(null);
    const [firstName, setFirstName] = useState(user?.first_name);
    const [lastName, setLastName] = useState(user?.last_name);
    const [isUploading, setIsUploading] = useState(false);

    const handleFirstNameChange = (e: any) => {
      setFirstName(e.target.value);
    };

    const handleLastNameChange = (e: any) => {
      setLastName(e.target.value);
    };

    const handleSubmit = async () => {
      const token = session?.access_token;
      const userId = user?.id;

      if (!token || !userId) {
        toast.error('Session or User information missing. Please try again.');
        return;
      }

      if (isUploading) return;

      setIsUploading(true);
      let profileImageUpload;

      let data: AttendeeData = {
        id: userId,
        first_name: firstName ?? '',
        last_name: lastName ?? '',
        initial_setup: true
      };

      if (acceptedFiles && acceptedFiles.length > 0) {
        try {
          profileImageUpload = await fileUpload(
            token,
            acceptedFiles[0]
          );
          data = { ...data, profile_image: profileImageUpload.id };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error('Error in file upload:', error);
          toast.error('Failed to upload profile image: ' + errorMessage);
          setIsUploading(false);
          return;
        }
      }

      try {
        await patchMe(token, data);
        localStorage.setItem('initial_setup', 'true');
        toast.success('Account set up successfully!');
        window.location.reload();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error updating attendee:', error);
        toast.error('Failed to update profile: ' + errorMessage);
        setIsUploading(false);
      }
    };

    return (
      <div>
        {user?.initial_setup === false  && localInitialSetup !== 'true' && (
          <Modal toggleOverlay={toggleOverlay}>
            {
              <div className="p-6">
                <h2 className="text-xl text-[#4D97E8] pb-2">
                  Set up your account
                </h2>
                <span>
                  We imported your information from your application. Feel free
                  to make adjustments below.
                </span>

                <div className="mt-4">
                  <label htmlFor="first_name">First Name</label>
                  <br />
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    className="w-full h-8 placeholder:transition-all transition-all border-[1px] bg-white px-3 py-2 rounded-lg appearance-none rounded-t-md focus:z-10 sm:text-sm outline-0 hover:text-themelight hover:border-themePrimary focus:border-themePrimary hover:shadow-themeActive hover:border-opacity-100 text-themelight border-opacity-100 border-gray-300"
                    defaultValue={user?.first_name}
                    onChange={handleFirstNameChange}
                  />
                </div>
                <div className="mt-4">
                  <label htmlFor="last_name">Last Name</label>
                  <br />
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    className="mb-2 w-full h-8 placeholder:transition-all transition-all border-[1px] bg-white px-3 py-2 rounded-lg appearance-none rounded-t-md focus:z-10 sm:text-sm outline-0 hover:text-themelight hover:border-themePrimary focus:border-themePrimary hover:shadow-themeActive hover:border-opacity-100 text-themelight border-opacity-100 border-gray-300"
                    defaultValue={user?.last_name}
                    onChange={handleLastNameChange}
                  />
                </div>
                <span>Upload a profile picture!</span>
                <Dropzone
                  acceptedFiles={acceptedFiles}
                  setAcceptedFiles={setAcceptedFiles}
                  rejectedFiles={rejectedFiles}
                  setRejectedFiles={setRejectedFiles}
                  extraInputProps={{
                    'data-testid': 'initial-setup-profile-image'
                  }}
                />
                <button
                  className="transition-all mx-auto mb-auto mt-4 bg-[#4D97E8] hover:bg-[#4589d2] px-7 py-2 rounded-full text-white"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            }
          </Modal>
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      {status === 'authenticated' ? (
        <>
          {!user?.initial_setup && <SetupModal toggleOverlay={toggleOverlay} />}
          <h1 className="text-2xl">Welcome{user?.first_name ? `, ${user.first_name}` : ''}!</h1>
          <hr className="my-4" />
          <div className="w-full pb-6 mb-6 rounded-lg shadow-md">
            <div className="h-2 w-full bg-[#4D97E8] rounded-t-lg" />
            <div className="flex items-center pt-6 pl-6">
              <img src="icons/dashboard/congrats.svg" alt="congrats!" />
              <div className="ml-2 text-xl">CONGRATS!</div>
            </div>
            {WelcomeCopy}
          </div>

          <div className="p-4 w-full bg-gradient-to-br from-[#59BFDC] to-[#3C60F9] rounded-[10px] shadow mb-6">
            {user?.id && (
              <div className="grid px-8 py-4 md:grid-cols-2 gap-x-2">
                <div className="flex flex-col items-center justify-center">
                  {user.event_rsvp.id && (
                    <QRCodeGenerator value={user.event_rsvp.id} />
                  )}
                  <div className="pt-2 pb-4 text-white">
                    <span>{user.first_name}</span>{' '}
                    <span>{user.last_name}</span>
                  </div>
                  <div className="w-32 h-9 bg-neutral-800 rounded-[5px] flex justify-center items-center text-white">
                    {getParticipationClassName(user.event_rsvp.participation_class ?? '')}
                  </div>
                  <div className="pt-6 pb-4 text-white">
                    Show QR code to check in
                  </div>
                </div>
                <div className="max-w-[330px] mx-auto text-white text-base font-light flex justify-center items-center">
                  When you arrive, show our staff the QR code to get registered
                  and checked in at the event. <br />
                  <br />
                  Please bring valid photo ID with your name and picture.
                </div>
              </div>
            )}
          </div>

          {user?.participation_class === 'P' && (
            <div className="">
            {/* <div className="w-full pb-6 mb-6 rounded-lg shadow-md"> */}
              {/* <div className="h-2 w-full bg-[#4D97E8] rounded-t-lg" />
              <div className="flex items-center pt-6 pl-6">
                <img src="icons/dashboard/forms.svg" alt="congrats!" />
                <div className="ml-2 text-xl">FORMS</div>
              </div>
              <div className="flex flex-col items-center justify-center p-6">
                Travel Scholarship
                <br />
                Deadline - Jan 10
                <a
                  className="mx-auto mt-4 bg-[#4D97E8] px-8 py-2 rounded-full text-white"
                  href="https://forms.gle/3iGGycnv3bQc8sbCA"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply
                </a>
              </div> */}
              {/* <div className="grid grid-cols-1 px-4 divide-x divide-y md:grid-cols-2">
            <div className="flex flex-col items-center justify-center p-6">
              Travel Scholarship
              <br />
              Deadline - 01 / 10
              <a
                className="mx-auto mt-4 bg-[#4D97E8] px-8 py-2 rounded-full text-white"
                href="https://forms.gle/3iGGycnv3bQc8sbCA"
                target="_blank"
                rel="noopener noreferrer"
              >
                Apply
              </a>
            </div>
            <div className="flex flex-col items-center justify-center p-6 !border-t-0 border-reset-tl">
              Scholarship Form
              <button
                disabled={true}
                className="mx-auto mt-4 bg-[#ececec] border-[#c1c1c1] border px-8 py-2 rounded-full text-[#969696]"
              >
                Coming soon
              </button>
            </div>
            <div className="flex flex-col items-center justify-center p-6 !border-l-0">
              Hardware Hack Form
              <button
                disabled={true}
                className="mx-auto mt-4 bg-[#ececec] border-[#c1c1c1] border px-8 py-2 rounded-full text-[#969696]"
              >
                Coming soon
              </button>
            </div>
            <div className="flex flex-col items-center justify-center p-6 border-reset-bl">
              Future Constructors Form
              <button
                disabled={true}
                className="mx-auto mt-4 bg-[#ececec] border-[#c1c1c1] border px-8 py-2 rounded-full text-[#969696]"
              >
                Coming soon
              </button>
            </div>
          </div> */}
            </div>
          )}

          <div className="w-full pb-6 mb-12 rounded-lg shadow-md">
            <div className="h-2 w-full bg-[#4D97E8] rounded-t-lg" />
            <div className="flex items-center pt-6 pl-6">
              <img src="icons/dashboard/home.svg" alt="congrats!" />
              <div className="ml-2 text-xl">GETTING TO THE HACKATHON</div>
            </div>
            {gettingToTheHackCopy}
          </div>

          <div className="w-full pb-6 mb-12 rounded-lg shadow-md h-fit">
            <div className="h-2 w-full bg-[#4D97E8] rounded-t-lg" />
            <div className="flex items-center pt-6 pl-6">
              <img src="icons/dashboard/airplane.svg" alt="congrats!" />
              <div className="ml-2 text-xl">TRAVEL & ACCOMODATIONS</div>
            </div>
            <div className="grid px-8 py-4 md:grid-cols-2 gap-x-2">
              <div className="p-6">
                Have you booked travel and accommodations yet? <br /> <br />
                {travelAccomodationsCopy}
              </div>
              <div className="p-6 border-t md:border-l md:border-t-0">
                <span className="font-bold">
                  We recommend booking now to get the best prices and take advantage of our discounts.
                </span>
                The longer you wait, the more expensive it may become. You can
                even coordinate with other participants through our Discord to
                lower your costs.
                <br /> <br />
                <span className="font-bold">
                  We have discounts!  
                </span>{' '}
                 <a
                   href="https://mitrealityhack.notion.site/Reality-Hack-at-MIT-2026-Group-Accommodation-Rates-1978c5dbe2bd81949e9fe2c72efcc2b4"
                   className="text-[#4D97E8] hover:underline"
                   target="_blank"
                   rel="noopener noreferrer"
                 >
                   Check this Notion page
                 </a> to keep up to date on all of our available accommodations discounts
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}
