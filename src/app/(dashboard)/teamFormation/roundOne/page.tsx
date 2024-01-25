"use client"
import Round from '@/components/teamFormation/Round';
import React, { useState, useEffect } from 'react';

export default function RoundOne() {
  const team = [
    { name: 'Santiago Dimaren' },
    { name: 'Shane Sengelman' },
    { name: 'Austin Edelman' },
    { name: 'Stepan Something' },
    { name: 'Peter Something' }
  ];

  return (
    <div>
      <Round round={1} location="Table 1" track="track 8" team={team} />
    </div>
  );
}