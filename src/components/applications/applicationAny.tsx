'use client';

import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Layout from '@/components/HotkeyLayout';
import {
  disability_identity,
  hardware_hack_interest,
  gender_identity
} from '../../application_form_types';
import {
  createApplication,
  fileUpload,
  patchFileUpload
} from '@/app/api/application';

interface AnyAppProps {
  tabs: React.ReactNode[];
  AppType: string;
  formData: any;
  isTabValid: (tabName: string) => boolean;
  acceptedFiles: File[];
  tabNames: string[];
}

const AnyApp: NextPage<AnyAppProps> = React.memo(function AnyApp({
  tabs,
  tabNames,
  AppType,
  isTabValid,
  acceptedFiles,
  ...formData
}) {
  const DEBUG = true;
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (_event: any, newValue: number) => {
    setSelectedTab(newValue);
  };

  const callRequest = async () => {
    let updatedPayload = formData.formData || formData;
    let fileUploadResponse;

    // File upload
    if (acceptedFiles?.length > 0) {
      const file = acceptedFiles[0];
      fileUploadResponse = await fileUpload(file);
      updatedPayload.resume = fileUploadResponse.id;
    }

    // Add https:// prefix if missing
    ['communications_platform_username', 'portfolio'].forEach(field => {
      if (
        updatedPayload[field] &&
        !updatedPayload[field].startsWith('https://')
      ) {
        updatedPayload[field] = `https://${updatedPayload[field]}`;
      }
    });

    // // If industry has no values, set to null
    // updatedPayload.industry = updatedPayload.industry || ['hello'];

    // if hardware_hack_interest has no values, set to A
    updatedPayload.hardware_hack_interest =
      updatedPayload.hardware_hack_interest || 'A';

    // Check if middle_name is not null, then trim and check if it's empty to set to null
    updatedPayload.middle_name =
      updatedPayload.middle_name && updatedPayload.middle_name.trim() === ''
        ? null
        : updatedPayload.middle_name;

    // Send payload
    await createApplication(updatedPayload);

    // Patch file upload to set 'claimed' to true
    await patchFileUpload(fileUploadResponse.id);

    // POST skill proficiencies here...

    setSelectedTab(prevTab => (prevTab + 1) % tabs.length);

    return;
  };

  const handleNextTab = async () => {
    if (isOnSubmitTab) {
      callRequest();
      return;
    }
    setSelectedTab(prevTab => (prevTab + 1) % tabs.length);
  };

  const handlePreviousTab = () => {
    setSelectedTab(prevTab => (prevTab - 1 + tabs.length) % tabs.length);
  };

  const isOnFirstTab = selectedTab === 0;
  const isOnSubmitTab = selectedTab === tabs.length - 2;
  const isOnLastTab = selectedTab === tabs.length - 1;

  return (
    <Layout>
      <div
        className="fixed w-full h-full bg-center bg-cover "
        style={{ backgroundImage: `url('/images/starfield-grad.jpg')` }}
      />
      <div className="flex flex-col items-center justify-center py-8 pb-32 mx-4">
        <div className="relative z-10 items-center mx-auto">
          <div className="w-[250px] h-[250px] mt-8 mx-auto bg-logocolor dark:bg-logobw bg-contain bg-no-repeat bg-center" />
          <div className="pb-8">
            <h1 className="py-1 text-2xl leading-8 text-center text-themeSecondary drop-shadow-md font-ethnocentric">
              MIT Reality Hack 2024
            </h1>
            <h2 className="text-2xl font-bold leading-8 text-center text-themeYellow drop-shadow-md">
              {' '}
              {AppType} Application
            </h2>
          </div>
        </div>
        <div className="flex flex-col px-2 md:px-4 py-2 bg-white rounded-lg shadow-md z-[10] mx-8 sm:mx-auto max-w-full md:w-[856px]">
          <div className="flex flex-row justify-center mb-4 overflow-x-auto overflow-y-hidden ">
            {!isOnLastTab && (
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                indicatorColor="secondary"
              >
                {tabNames.map((tabName, index) => {
                  let disableTab = false;
                  for (let i = 0; i < index; i++) {
                    if (!isTabValid(tabNames[i])) {
                      disableTab = true;
                      break;
                    }
                  }
                  return (
                    <Tab
                      key={index}
                      label={
                        <span
                          className={`text-purple-900 text-xs ${
                            disableTab ? 'text-opacity-50' : 'text-opacity-100'
                          } transition-all ${
                            selectedTab === index
                              ? 'font-semibold'
                              : 'font-medium'
                          }`}
                        >
                          {tabName}
                        </span>
                      }
                      disabled={disableTab}
                    />
                  );
                })}
              </Tabs>
            )}
          </div>

          <div className="mt-2 overflow-y-auto">
            {tabs.map((tabContent, index) => {
              return selectedTab === index ? tabContent : null;
            })}
          </div>

          {!isOnLastTab && (
            <div className="flex justify-start mb-4 ml-6 space-x-4">
              <button
                onClick={handlePreviousTab}
                className="cursor-pointer text-white bg-[#493B8A] px-4 py-2 rounded-lg disabled:opacity-50 transition-all"
                disabled={isOnFirstTab}
              >
                Previous
              </button>
              <button
                onClick={handleNextTab}
                className="cursor-pointer text-white bg-[#493B8A] px-4 py-2 rounded-lg disabled:opacity-50 transition-all"
                disabled={!isTabValid(tabNames[selectedTab])}
              >
                {isOnSubmitTab ? 'Submit' : 'Next'}
              </button>
              {DEBUG && (
                <button
                  onClick={handleNextTab}
                  className="ml-4 cursor-pointer text-white w-20 bg-[#493B8A] px-4 py-2 rounded-lg disabled:opacity-50 transition-all"
                >
                  Debug
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
});

export default AnyApp;
