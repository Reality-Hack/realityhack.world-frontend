'use client';
import Dropzone from '@/components/Dropzone';
import { useAuthContext } from '@/hooks/AuthContext';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { updateAttendee } from '../../api/attendee';
import { fileUpload } from '../../api/application';

export default function Settings() {
  const { data: session } = useSession();
  const { user } = useAuthContext();

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
    <div className="p-6">
      <h1 className="mb-8 text-2xl">Settings</h1>

      <div className="mx-auto h-2 max-w-[600px] bg-[#4D97E8] rounded-t-lg" />
      <div className="mx-auto max-w-[600px] p-4 pb-6 mb-6 rounded-lg shadow-md ">
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
        <span>Upload your profile picture</span>
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
    </div>
  );
}
