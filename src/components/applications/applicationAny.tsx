'use client';
import React, { useState } from 'react';
import type { NextPage } from 'next';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Layout from '@/components/HotkeyLayout';

interface AnyAppProps {
  tabs: React.ReactNode[];
  AppType: string;
}

const AnyApp: NextPage<AnyAppProps> = ({ tabs, AppType }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: any, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleNextTab = () => {
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
        className="h-screen bg-cover bg-center"
        style={{ backgroundImage: `url('/images/starfield-grad.jpg')` }}
      >
        <div className="h-screen flex items-center justify-center">
          <div className="bg-white p-4 shadow-md rounded-lg h-2/3 w-2/3 flex flex-col">
            <h1 className="text-2xl font-italics text-center">
              MIT Reality Hack 2024 -
              <span className="text-2xl font-bold text-center mb-4">
                {' '}
                {AppType}{' '}
              </span>
              Application
            </h1>

            <div className="flex justify-center space-x-4 mb-4">
              <button
                onClick={handlePreviousTab}
                className={`text-lg cursor-pointer text-blue-500 hover:bg-blue-200 ${
                  isOnFirstTab ? 'pointer-events-none text-gray-400' : ''
                }`}
                disabled={isOnFirstTab}
              >
                Previous
              </button>
              <button
                onClick={handleNextTab}
                className="text-lg cursor-pointer text-blue-500 hover-bg-blue-200"
              >
                {isOnFinalTab ? 'Submit' : 'Next'}
              </button>
            </div>

            <div className="overflow-x-auto flex flex-row justify-center">
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                className="mb-8"
                indicatorColor="secondary"
              >
                {tabs.map((tab, index) => (
                  <Tab
                    key={index}
                    label={
                      <span
                        className={`text-purple-900 ${
                          selectedTab === index ? 'font-semibold text-lg' : ''
                        }`}
                      >
                        {`Page ${index + 1}`}
                      </span>
                    }
                  />
                ))}
              </Tabs>
            </div>

            <div className="overflow-y-auto mt-2">{tabs[selectedTab]}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnyApp;
