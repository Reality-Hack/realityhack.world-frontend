'use client';

import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Layout from '@/components/HotkeyLayout';
import { createApplication } from '@/app/api/application';

interface AnyAppProps {
  tabs: React.ReactNode[];
  AppType: string;
  formData: any;
  isTabValid: (tabName: string) => boolean;
}

const tabNames = [
  'WELCOME',
  'DISCLAIMERS',
  'PERSONAL INFO',
  'DIVERSITY & INCLUSION',
  'EXPERIENCE',
  'THEMATIC',
  'CLOSING',
  'REVIEW & SUBMIT'
];

const AnyApp: NextPage<AnyAppProps> = React.memo(function AnyApp({
  tabs,
  AppType,
  isTabValid,
  ...formData
}) {
  const DEBUG = true;
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (_event: any, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleNextTab = () => {
    if (isOnFinalTab) {
      let updatedPayload = formData.formData || formData;

      // 'heard_about_us' should be multiselect
      if (
        Array.isArray(updatedPayload.heard_about_us) &&
        updatedPayload.heard_about_us.length > 0
      ) {
        updatedPayload.heard_about_us = updatedPayload.heard_about_us[0];
      }

      // 'ocupation', 'employer', and 'middle_name' should not be required

      // 'city' and 'country' fields using 'current_city' and 'current_country'
      // duplicates of 'city' and 'country' fields in application form
      updatedPayload.city = updatedPayload.current_city;
      updatedPayload.country = updatedPayload.current_country;

      // dummy data for RSVP form (not part of application form)
      updatedPayload.emergency_contact_email = 'dummy_email@test.com';
      updatedPayload.emergency_contact_name = 'Dummy Name';
      updatedPayload.emergency_contact_phone_number = '+19526207121';
      updatedPayload.emergency_contact_relationship = 'Friend';
      updatedPayload.phone_number = '+19526207121';
      updatedPayload.us_visa_support_is_required = false;

      // send payload
      createApplication(updatedPayload);
      return;
    }
    setSelectedTab(prevTab => (prevTab + 1) % tabs.length);
  };

  const handlePreviousTab = () => {
    setSelectedTab(prevTab => (prevTab - 1 + tabs.length) % tabs.length);
  };

  const isOnFirstTab = selectedTab === 0;
  const isOnFinalTab = selectedTab === tabs.length - 1;

  return (
    <Layout>
      <div
        className="fixed w-screen h-screen bg-center bg-cover"
        style={{ backgroundImage: `url('/images/starfield-grad.jpg')` }}
      />
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col w-2/3 px-2 py-11 bg-white rounded-lg shadow-md z-[10] min-h-[500px]">
          <h1 className="text-2xl text-center font-italics">
            MIT Reality Hack 2024 -
            <span className="mb-4 text-2xl font-bold text-center">
              {' '}
              {AppType}{' '}
            </span>
            Application
          </h1>
          <div className="flex flex-row justify-center mb-4 overflow-x-auto overflow-y-hidden ">
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
          </div>

          <div className="mt-2 overflow-y-auto">
            {tabs.map((tabContent, index) => {
              return selectedTab === index ? tabContent : null;
            })}
          </div>

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
              {isOnFinalTab ? 'Submit' : 'Next'}
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
        </div>
      </div>
    </Layout>
  );
});

export default AnyApp;
