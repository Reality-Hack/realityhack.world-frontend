'use client';
import { useSession } from 'next-auth/react';
import Help2 from './helpTwo';
import React, { useState } from 'react';
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
      <Help2 />
      {/* <LighthouseTable /> */}
    </>
    // <div className="w-screen h-screen bg-white">
    //   <div className="p-4 text-4xl"> Help Queue</div>
    //   <div className="flex flex-col gap-8 p-4 m-4 bg-gray-200 rounded-md">
    //     <div className="flex gap-4">
    //       <StatBox src="/icons/dashboard/mentee_1.png" label="Active Requests" stat="9" />
    //       <StatBox src="/icons/dashboard/help.png" label="Mentors Available" stat="9" />
    //     </div>
    //     <div className="flex ">
    //       <div className="text-4xl font-semibold"> Your Help Requests</div>
    //       <div
    //         className="p-2 mx-2 ml-auto bg-red-200 cursor-pointer rounded-2xl"
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
    //         className="transition-transform transform cursor-pointer hover:rotate-90"
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
