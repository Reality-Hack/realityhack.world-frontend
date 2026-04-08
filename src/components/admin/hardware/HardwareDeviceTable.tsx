import { useMemo } from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';
import Chip from '@mui/material/Chip';
import Table from '@/components/Table';
import type { HardwareCount, HardwareDevice, HardwareRequestList } from '@/types/models';
import AppButton from '@/components/common/AppButton';

export type HardwareDeviceTableProps = {
  data: HardwareDevice[];
  loading?: boolean;
  /** Map catalog hardware id → row from `useHardwareList` for name lookup. */
  hardwareById: Record<string, HardwareCount>;
  /**
   * When set, only devices whose `hardware` id appears in this catalog slice are shown
   * (e.g. that sponsor’s hardware types). Omit to show all `data`.
   */
  sponsorCatalog?: HardwareCount[];
  onRowClick?: (row: Row<HardwareDevice>) => void;
  onEdit?: (row: HardwareDevice) => void;
  getRowId?: (originalRow: HardwareDevice, index: number) => string;
  search?: boolean;
  pagination?: boolean;
};

function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function HardwareDeviceTable({
  data,
  loading = false,
  hardwareById,
  sponsorCatalog,
  onRowClick,
  onEdit,
  getRowId,
  search = true,
  pagination = true,
}: HardwareDeviceTableProps): JSX.Element {
  
  
  const allowedHardwareIds = useMemo(() => {
    if (sponsorCatalog === undefined) {
      return null;
    }
    return new Set(
      sponsorCatalog.map((h) => h.id).filter((id): id is string => Boolean(id)),
    );
  }, [sponsorCatalog]);
  
  const rows = useMemo(() => {
    if (!allowedHardwareIds) {
      return data;
    }
    return data.filter((d) => allowedHardwareIds.has(d.hardware));
  }, [data, allowedHardwareIds]);

  const columns = useMemo((): ColumnDef<HardwareDevice>[] => {
    const cols: ColumnDef<HardwareDevice>[] = [
      {
        id: 'serial',
        header: 'Serial',
        accessorKey: 'serial',
        cell: ({ row }) => (
          <span className="font-mono">{row.original.serial}</span>
        ),
      },
      {
        id: 'hardware_name',
        header: 'Hardware type',
        accessorFn: (row) => hardwareById[row.hardware]?.name ?? row.hardware,
        cell: ({ row }) => (
          <span>{hardwareById[row.original.hardware]?.name ?? row.original.hardware}</span>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        accessorFn: (row) => (row.checked_out_to ? 'checked_out' : 'available'),
        cell: ({ row }) =>
          row.original.checked_out_to ? (
            <Chip label="Checked out" size="small" color="warning" />
          ) : (
            <Chip label="Available" size="small" color="success" />
          ),
      },
      {
        id: 'updated_at',
        header: 'Updated',
        accessorKey: 'updated_at',
        cell: ({ row }) => (
          <span className="text-xs text-gray-600">{formatDate(row.original.updated_at)}</span>
        ),
      },
      {
        id: 'created_at',
        header: 'Created',
        accessorKey: 'created_at',
        cell: ({ row }) => (
          <span className="text-xs text-gray-600">{formatDate(row.original.created_at)}</span>
        ),
      },
    ];

    if (onEdit) {
      cols.push({
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-row justify-center flex-wrap items-center gap-2">
            <AppButton
              size="xs"
              onClick={() => onEdit(row.original)}
            >
              Edit
            </AppButton>
          </div>
        ),
      });
    }

    return cols;
  }, [hardwareById, onEdit]);

  return (
    <div className="border border-[#EEEEEE] rounded-xl overflow-hidden">
      <Table<HardwareDevice>
        data={rows}
        columns={columns}
        loading={loading}
        onRowClick={onRowClick}
        search={search}
        pagination={pagination}
        getRowId={getRowId ?? ((row) => row.id ?? '')}
        defaultSorting={[{ id: 'serial', desc: false }]}
      />
    </div>
  );
}
