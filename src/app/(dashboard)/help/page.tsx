'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react';
import LighthouseTable from "./websocket"
import { StatBox, CompletedPosting, Posting, Skill, Dialog, QuestionDialog, SelectedFile } from '@/components/helpQueue/HelpQueueComps';

export default function Help() {
  const { data: session, status } = useSession();
  const exampleSkillList = ['React', 'JavaScript', 'CSS', 'Node.js'];
  const [showCompletedRequests, setShowCompletedRequests] = useState(true);
  const [isNewRequestDialogOpen, setNewRequestDialogOpen] = useState(false);

  const toggleCompletedRequests = () => {
    setShowCompletedRequests(prev => !prev);
  };

  const completedRequestsArrow = showCompletedRequests ? '▼' : '▶';

  const openNewRequestDialog = () => {
    setNewRequestDialogOpen(true);
  };

  const closeNewRequestDialog = () => {
    setNewRequestDialogOpen(false);
  };
  

  return (
    <>
      <div>Help</div>
      <LighthouseTable />
    </>
    // <div className="h-screen w-screen bg-white">
    //   <div className="text-4xl p-4"> Help Queue</div>
    //   <div className="flex flex-col gap-8 m-4 p-4 rounded-md bg-gray-200">
    //     <div className="flex gap-4">
    //       <StatBox src="/icons/dashboard/mentee_1.png" label="Active Requests" stat="9" />
    //       <StatBox src="/icons/dashboard/help.png" label="Mentors Available" stat="9" />
    //     </div>
    //     <div className="flex ">
    //       <div className="text-4xl font-semibold"> Your Help Requests</div>
    //       <div
    //         className="bg-red-200 ml-auto p-2 cursor-pointer rounded-2xl mx-2"
    //         onClick={openNewRequestDialog}
    //       >
    //         New Help Request
    //       </div>
    //     </div>
    //     <div className="flex flex-wrap gap-2">
    //       {/* Your Posting components here */}
    //       <Posting
    //         mentorFirstName="Shane"
    //         mentorLastName="Sengelman"
    //         requestTitle="Your Request Title"
    //         placeInQueue={4}
    //         skillList={exampleSkillList}
    //         description="Your Request Description"
    //       />
    //       <Posting
    //         requestTitle="Your Request Title"
    //         placeInQueue={5}
    //         skillList={exampleSkillList}
    //         description="Your Request Description"
    //       />
    //     </div>

    //     <div className="font-semibold">
    //       Show/Hide Completed Requests{' '}
    //       <span
    //         onClick={toggleCompletedRequests}
    //         className="cursor-pointer transform hover:rotate-90 transition-transform"
    //       >
    //         {completedRequestsArrow}
    //       </span>
    //     </div>

    //     {showCompletedRequests && (
    //       <div className="flex flex-wrap gap-2">
    //         <CompletedPosting
    //           requestTitle="Your Request Title"
    //           skillList={exampleSkillList}
    //           description="Your Request Description"
    //         />
    //         <CompletedPosting
    //           requestTitle="Your Request Title"
    //           skillList={exampleSkillList}
    //           description="Your Request Description"
    //         />
    //       </div>
    //     )}
    //   </div>
    //   <QuestionDialog
    //     isNewRequestDialogOpen={isNewRequestDialogOpen}
    //     closeNewRequestDialog={closeNewRequestDialog}
    //   />{' '}
    // </div>
  );
}

