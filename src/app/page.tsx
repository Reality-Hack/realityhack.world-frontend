'use client';
import { useSession } from 'next-auth/react';
import React from "react";
import ReactDOM from "react-dom";
import QRCodeGenerator from "@/components/dashboard/QRCodeGenerator";


export default function Dashboard() {
  const { data: session, status } = useSession();

  return (
    <div className="h-screen p-6">
      {status === 'authenticated' && (
        <>
          <h1>Dashboard</h1>
          <br></br>
          <QRCodeGenerator value="DUMMY-ID" />
        </>
      )}
    </div>
  );
}
