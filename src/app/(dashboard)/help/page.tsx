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
    </>
  );
}
