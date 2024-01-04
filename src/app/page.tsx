'use client';
import Dropzone from '@/components/Dropzone';
import Modal from '@/components/Modal';
import { useAuthContext } from '@/hooks/AuthContext';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { updateAttendee } from './api/attendee';
import { fileUpload } from './api/application';
import QRCodeGenerator from '@/components/dashboard/QRCodeGenerator';

type SetupModalProps = {
  toggleOverlay: () => void;
};

export default function Dashboard() {
  const { data: session } = useSession();
  const { user } = useAuthContext();

  const [_isOverlayVisible, setOverlayVisible] = useState(false);

  const toggleOverlay = () => {
    setOverlayVisible(prev => !prev);
  };

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
      if (isUploading) return;

      setIsUploading(true);
      let profileImageUpload;

      if (session) {
        const data = {
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          initial_setup: 'True',
          profile_image: null
        };

        if (acceptedFiles && acceptedFiles.length > 0) {
          try {
            profileImageUpload = await fileUpload(acceptedFiles[0]);
            data.profile_image = profileImageUpload.id;
          } catch (error) {
            console.error('Error in file upload:', error);
            setIsUploading(false);
            return;
          }
        }

        try {
          await updateAttendee(session.access_token, data);
          console.log('Attendee updated successfully!');
          window.location.reload();
        } catch (error) {
          console.error('Error updating attendee:', error);
        }
      }
    };

    return (
      <div>
        {user?.initial_setup === false && (
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
      {!user?.initial_setup && <SetupModal toggleOverlay={toggleOverlay} />}
      <h1 className="text-2xl">Welcome, {user?.first_name}!</h1>
      <hr className="my-4" />
      <div className="w-full pb-6 mb-6 rounded-lg shadow-md">
        <div className="h-2 w-full bg-[#4D97E8] rounded-t-lg" />
        <div className="flex items-center pt-6 pl-6">
          <img src="icons/dashboard/congrats.svg" alt="congrats!" />
          <div className="ml-2 text-xl">CONGRATS!</div>
        </div>
        <div className="p-6">
          Now that you’ve RSVP’d to MIT Reality Hack 2024, make sure you join
          our Discord to start chatting with other accepted participants,
          coordinate housing, share resources, and get to know each other!
          We&apos;ll also be running the event and posting announcements through
          Discord!
        </div>
        <div className="flex justify-center">
          <button className="mx-auto mt-4 bg-[#4D97E8] px-7 py-2 rounded-full text-white">
            Join our Discord
          </button>
        </div>
      </div>

      <div className="p-4 w-full bg-gradient-to-br from-[#59BFDC] to-[#3C60F9] rounded-[10px] shadow mb-6">
        {user && (
          <div className="grid px-8 py-4 md:grid-cols-2 gap-x-2">
            <div className="flex flex-col items-center justify-center">
              <QRCodeGenerator value={user?.id} />
              <div className="pt-2 pb-4 text-white">
                <span>{user?.first_name}</span> <span>{user?.last_name}</span>
              </div>
              <div className="w-32 h-9 bg-neutral-800 rounded-[5px] flex justify-center items-center text-white">
                {user.participation_class === 'P'
                  ? 'Hacker'
                  : user.participation_class === 'M'
                  ? 'Mentor'
                  : 'Judge'}
              </div>
              <div className="pt-6 pb-4 text-white">
                Show QR code to check in
              </div>
            </div>
            <div className="max-w-[330px] mx-auto text-white text-base font-light font-['Inter'] flex justify-center items-center">
              When you arrive, show our staff the QR code to get registered and
              checked in at the event. <br />
              <br />
              Please bring valid photo ID with your name and picture.
            </div>
          </div>
        )}
      </div>

      <div className="w-full pb-6 mb-6 rounded-lg shadow-md">
        <div className="h-2 w-full bg-[#4D97E8] rounded-t-lg" />
        <div className="flex items-center pt-6 pl-6">
          <img src="icons/dashboard/forms.svg" alt="congrats!" />
          <div className="ml-2 text-xl">FORMS</div>
        </div>
        <div className="grid grid-cols-1 px-4 divide-x divide-y md:grid-cols-2">
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
        </div>
      </div>

      <div className="w-full pb-6 mb-12 rounded-lg shadow-md">
        <div className="h-2 w-full bg-[#4D97E8] rounded-t-lg" />
        <div className="flex items-center pt-6 pl-6">
          <img src="icons/dashboard/home.svg" alt="congrats!" />
          <div className="ml-2 text-xl">GETTING TO THE HACKATHON</div>
        </div>
        <div className="p-6">
          We know that a 5-day hackathon event can be overwhelming. If you have
          any questions that you want to know the answers to, feel free to ask
          the organizers on Discord in the #questions-to-organizers channel!
        </div>
        <div className="flex justify-center">
          <button className="mx-auto mt-4 bg-[#4D97E8] px-7 py-2 rounded-full text-white">
            Join our Discord
          </button>
        </div>
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
            <span className="font-bold">
              You should plan to be in Boston on the evening of January 24th as
              we begin bright and early on the 25th.
            </span>{' '}
            You can also plan to wrap up by around 5pm EST on the 29th. We’ll
            release our full schedule later but you can use our guidelines right
            now to plan travel. <br /> <br />
            <span className="font-bold">
              We recommend booking early to get the best prices.
            </span>
            The longer you wait, the more expensive it may become. You can even
            coordinate with other participants through our Discord to lower your
            costs.
          </div>
          <div className="p-6 border-t md:border-l md:border-t-0">
            <p>Here are some suggested places to look:</p>
            <ul className="pl-10 mt-4 mb-4 list-disc">
              <li className="mb-2">
                <a
                  href="https://www.marriott.com/en-us/hotels/boscb-boston-marriott-cambridge/overview/"
                  className="block pt-4 pb-2 text-sm text-[#4d97e8] hover:text-[#3f7ec1] w-fit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Boston Marriott Cambridge
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="https://www.marriott.com/en-us/hotels/bosbm-le-meridien-boston-cambridge/overview/"
                  className="block pb-2 text-sm text-[#4d97e8] hover:text-[#3f7ec1] w-fit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Le Méridien Boston Cambridge
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="https://www.marriott.com/en-us/hotels/boscm-residence-inn-boston-cambridge/overview/?scid=f2ae0541-1279-4f24-b197-a979c79310b0"
                  className="block pb-2 text-sm text-[#4d97e8] hover:text-[#3f7ec1] w-fit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Residence Inn Boston Cambridge
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="https://kendallhotel.com/"
                  className="block pb-2 text-sm text-[#4d97e8] hover:text-[#3f7ec1] w-fit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  The Kendall Hotel
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="https://www.hyatt.com/en-US/hotel/massachusetts/hyatt-regency-boston-cambridge/bosrc"
                  className="block pb-2 text-sm text-[#4d97e8] hover:text-[#3f7ec1] w-fit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hyatt Regency Boston / Cambridge
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="https://www.hiusa.org/find-hostels/massachusetts/boston-19-stuart-street"
                  className="block pb-2 text-sm text-[#4d97e8] hover:text-[#3f7ec1] w-fit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  HI Boston Hostel
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="https://www.sonder.com/destinations/cambridge/907-main/c31633?sleeps=1"
                  className="block pb-2 text-sm text-[#4d97e8] hover:text-[#3f7ec1] w-fit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sonder 907 Main
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="https://www.airbnb.com/?locale=en"
                  className="block pb-2 text-sm text-[#4d97e8] hover:text-[#3f7ec1] w-fit "
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Check listings on Airbnb near MIT or near the Red Line
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
