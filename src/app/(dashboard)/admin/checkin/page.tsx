'use client';
import { useSession } from 'next-auth/react';
import React from "react";
import ReactDOM from "react-dom";
import QRCodeReader from '@/components/admin/QRCodeReader';


export default function Dashboard() {
  const { data: session, status } = useSession();

  return (
    <div className="h-screen p-6">
      {status === 'authenticated' && (
        <>
          <h1>User Checkin</h1>
          <br></br>
          <QRCodeReader/>
        </>
      )}
    </div>
  );
}