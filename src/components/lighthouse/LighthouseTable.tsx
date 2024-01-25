'use client';
import { LighthouseInfo } from '@/app/(dashboard)/lighthouses/page';
import { Table } from '@/app/api/lighthouse';
import TableComponent from '@/components/Table';
import {
  ColumnDef,
  RowSelectionState,
  createColumnHelper
} from '@tanstack/react-table';
import { HTMLProps, useEffect, useMemo, useRef, useState } from 'react';
import LighthouseDialog from './LighthouseDialog';

type LighthouseTableProps = {
  sendJsonMessage: (payload: any) => void;
  tables: Table[];
  lighthouses: LighthouseInfo[];
  loading: boolean;
};

export default function LighthouseTable({
  sendJsonMessage,
  tables,
  lighthouses,
  loading
}: LighthouseTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columnHelper = createColumnHelper<LighthouseInfo>();
  const columns = useMemo<ColumnDef<LighthouseInfo, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler()
              }}
            />
          </div>
        )
      },
      columnHelper.accessor('table', {
        header: () => 'Table Number',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('location', {
        header: () => 'Table Location',
        cell: info => `${info.getValue().building} ${info.getValue().room}`
      }),
      columnHelper.accessor('ip_address', {
        header: () => 'IP Address',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('mentor_requested', {
        header: () => 'Mentor Requested',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('announcement_pending', {
        header: () => 'Announcement Pending',
        cell: info => info.getValue()
      })
    ],
    [columnHelper]
  );

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const handleClose = () => {
    setDialogOpen(false);
  };
  const handleOpen = () => setDialogOpen(true);
  const [pendingTables, setPendingTables] = useState<number[]>([]);

  const handleSubmit = (payload: any) => {
    sendJsonMessage(payload);
    handleClose();
  };

  useEffect(() => {
    setPendingTables(Object.keys(rowSelection).map(key => Number(key)));
  }, [rowSelection, tables]);

  return (
    <>
      <div className="z-50 px-6 py-6 bg-[#FCFCFC] border-gray-300 rounded-2xl">
        <div className="h-[450px] overflow-y-scroll z-50 rounded-l border border-[#EEEEEE]">
          <TableComponent
            data={lighthouses ?? []}
            columns={columns}
            search={true}
            pagination={true}
            loading={loading}
            rowSelection={rowSelection}
            getRowId={originalRow => {
              return originalRow.table.toString();
            }}
            defaultSorting={[{ id: 'table', desc: false }]}
            setRowSelection={setRowSelection}
          />
        </div>
        <button
          className="transition-all mx-auto mb-auto mt-4 bg-[#4D97E8] hover:bg-[#4589d2] px-7 py-2 rounded-full text-white disabled:opacity-50 disabled:hover:none disabled:pointer-events-none"
          disabled={Object.keys(rowSelection).length === 0}
          onClick={handleOpen}
        >
          Send Announcement
        </button>
      </div>
      <LighthouseDialog
        handleClose={handleClose}
        dialogOpen={dialogOpen}
        pendingTables={pendingTables}
        onSubmit={handleSubmit}
      />
    </>
  );
}

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  );
}
