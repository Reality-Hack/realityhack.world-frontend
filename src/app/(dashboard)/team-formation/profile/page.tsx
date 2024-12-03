'use client';
import { useState } from 'react';
import { useAuthContext } from '@/hooks/AuthContext';
import { useSession } from 'next-auth/react';
import Loader from '@/components/Loader';

export default function RoundOne() {
  const { data: session, status } = useSession();
  const { user } = useAuthContext();
  const [firstName, setFirstName] = useState(user?.first_name);
  const [lastName, setLastName] = useState(user?.last_name);
  const [isUploading, setIsUploading] = useState(false);

  const handleFirstNameChange = (e: any) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: any) => {
    setLastName(e.target.value);
  };
  return (
    <div className="flex flex-col gap-2">
      {status === 'loading' && <Loader />}
      {status === 'authenticated' && (
        <div className="flex flex-col gap-2">
          <div>
            <div className="mx-auto h-2 bg-[#4D97E8] rounded-t-lg" />
            <div className="flex flex-col gap-2 rounded-lg shadow-md p-4">
              <div className="text-lg">Personal Information</div>
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
              <div className="mt-4">
                <label htmlFor="email">Email</label>
                <br />
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="w-full h-8 placeholder:transition-all transition-all border-[1px] bg-white px-3 py-2 rounded-lg appearance-none rounded-t-md focus:z-10 sm:text-sm outline-0 hover:text-themelight hover:border-themePrimary focus:border-themePrimary hover:shadow-themeActive hover:border-opacity-100 text-themelight border-opacity-100 border-gray-300"
                  defaultValue={user?.email}
                />
              </div>
              <div className="mt-4">
                <label htmlFor="location">Location</label>
                <br />
                <input
                  type="text"
                  name="location"
                  id="location"
                  className="w-full h-8 placeholder:transition-all transition-all border-[1px] bg-white px-3 py-2 rounded-lg appearance-none rounded-t-md focus:z-10 sm:text-sm outline-0 hover:text-themelight hover:border-themePrimary focus:border-themePrimary hover:shadow-themeActive hover:border-opacity-100 text-themelight border-opacity-100 border-gray-300"
                  defaultValue={user?.location}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="mx-auto h-2 bg-[#4D97E8] rounded-t-lg" />
            <div className="flex flex-col gap-2 rounded-lg shadow-md p-4">
              <div className="text-lg">Professional Details</div>
            </div>
          </div>
          <div>
            <div className="mx-auto h-2 bg-[#4D97E8] rounded-t-lg" />
            <div className="flex flex-col gap-2 rounded-lg shadow-md p-4">
              <div className="text-lg">Reality Hack Interests</div>
            </div>
          </div>
          <div>
            <div className="mx-auto h-2 bg-[#4D97E8] rounded-t-lg" />
            <div className="flex flex-col gap-2 rounded-lg shadow-md p-4">
              <div className="text-lg">Links</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
