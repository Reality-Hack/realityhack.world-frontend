'use client';
import { LightHouseMessage } from '@/app/api/lighthouse';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import LighthouseDialog from './LighthouseDialog';
import tablesJson from './tables.json';

export type TableJSON = {
  ML: {
    tables: TableCoordinates[];
  };
  Walker: {
    tables: TableCoordinates[];
  };
};

export type TableCoordinates = {
  number: number;
  canvasPosition: {
    x: number;
    y: number;
  };
};

const Canvas = dynamic(() => import('@/components/lighthouse/Canvas'), {
  ssr: false
});

type LighthouseFloorViewProps = {
  sendJsonMessage: (payload: any) => void;
  lighthouses: LightHouseMessage[];
  loading: boolean;
  isAdmin: boolean;
  isMentor: boolean;
};

export default function LighthouseFloorView({
  sendJsonMessage,
  lighthouses,
  loading,
  isAdmin,
  isMentor
}: LighthouseFloorViewProps) {
  const [pendingMLTables, setPendingMLTables] = useState<number[]>([]);
  const [pendingWTables, setPendingWTables] = useState<number[]>([]);

  const [allPendingTables, setAllPendingTables] = useState<number[]>([]);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const handleClose = () => {
    setAllPendingTables([]);
    setPendingMLTables([]);
    setPendingWTables([]);
    setDialogOpen(false);
  };
  const handleOpen = () => setDialogOpen(true);

  const handleOpenWithWalker = () => {
    setAllPendingTables(
      (tablesJson as TableJSON).Walker.tables.map(t => t.number)
    );
    setDialogOpen(true);
  };

  const handleOpenWithML = () => {
    setAllPendingTables((tablesJson as TableJSON).ML.tables.map(t => t.number));
    setDialogOpen(true);
  };

  const handleOpenWithAll = () => {
    const walkerTableNumbers = (tablesJson as TableJSON).Walker.tables.map(
      t => t.number
    );
    const mlTableNumbers = (tablesJson as TableJSON).ML.tables.map(
      t => t.number
    );
    setAllPendingTables(mlTableNumbers.concat(walkerTableNumbers));
    setDialogOpen(true);
  };

  const handleSubmit = (payload: any) => {
    sendJsonMessage(payload);
    handleClose();
  };

  useEffect(() => {
    setAllPendingTables(pendingMLTables.concat(pendingWTables));
  }, [pendingMLTables, pendingWTables]);

  return (
    <div className="p-6">
      {(isAdmin || isMentor) && (
        <div className="flex mb-4">
          <button
            className="transition-all  mx-2 bg-[#4D97E8] hover:bg-[#4589d2] px-7 py-2 rounded-full text-white disabled:opacity-50 disabled:hover:none disabled:pointer-events-none"
            disabled={
              pendingWTables.length === 0 && pendingMLTables.length === 0
            }
            onClick={handleOpen}
          >
            Send Message to Selected
          </button>
          {isAdmin && (
            <>
              <button
                className="transition-all mx-2 bg-[#4D97E8] hover:bg-[#4589d2] px-7 py-2 rounded-full text-white disabled:opacity-50 disabled:hover:none disabled:pointer-events-none"
                onClick={handleOpenWithWalker}
              >
                Send All to Walker
              </button>
              <button
                className="transition-all mx-2 bg-[#4D97E8] hover:bg-[#4589d2] px-7 py-2 rounded-full text-white disabled:opacity-50 disabled:hover:none disabled:pointer-events-none"
                onClick={handleOpenWithML}
              >
                Send All to Media Lab
              </button>
              <button
                className="transition-all mx-2 bg-[red] hover:bg-[darkred] px-7 py-2 rounded-full text-white disabled:opacity-50 disabled:hover:none disabled:pointer-events-none"
                onClick={handleOpenWithAll}
              >
                Send All
              </button>
            </>
          )}
        </div>
      )}
      <h2 className="text-xl text-[#4D97E8] pb-2">MIT Media Lab 6th Floor</h2>
      <Canvas
        img={'/images/mit media lab 6th floor.png'}
        width={800}
        height={600}
        lighthouses={lighthouses}
        tableCoordinates={(tablesJson as TableJSON).ML.tables}
        selected={pendingMLTables}
        setSelectedTables={setPendingMLTables}
        disableMultiSelect={!isAdmin}
        viewOnly={!isAdmin && !isMentor}
      />
      <h2 className="text-xl text-[#4D97E8] pb-2">Walker Memorial</h2>
      <Canvas
        img={'/images/walker memorial floor.png'}
        width={800}
        height={800}
        lighthouses={lighthouses}
        tableCoordinates={(tablesJson as TableJSON).Walker.tables}
        selected={pendingWTables}
        setSelectedTables={setPendingWTables}
        disableMultiSelect={!isAdmin}
        viewOnly={!isAdmin && !isMentor}
      />
      <LighthouseDialog
        handleClose={handleClose}
        dialogOpen={dialogOpen}
        pendingTables={allPendingTables}
        onSubmit={handleSubmit}
        isMentor={isMentor}
      />
    </div>
  );
}
