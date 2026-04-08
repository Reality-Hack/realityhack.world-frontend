import { useMemo } from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';
import Table from '@/components/Table';
import type { HardwareCount } from '@/types/models';
import { hardware_categories } from '@/types/types2';
import AppButton from '@/components/common/AppButton';

export type HardwareTableProps = {
  data: HardwareCount[];
  loading?: boolean;
  /** When set, only rows with this `sponsor_company` are shown. */
  sponsorCompanyId?: string | null;
  /** For the Sponsor column when not using a fixed sponsor filter. */
  sponsorNameById?: Record<string, string>;
  onRowClick?: (row: Row<HardwareCount>) => void;
  /** Renders an Actions column with Edit (stops row click propagation). */
  onEdit?: (row: HardwareCount) => void;
  /** Opens add-device flow for this catalog row (stops row click propagation). */
  onCreateDevices?: (row: HardwareCount) => void;
  getRowId?: (originalRow: HardwareCount, index: number) => string;
  search?: boolean;
  pagination?: boolean;
};

function formatTags(tags: HardwareCount['tags']): string {
  return tags.map((t) => hardware_categories[t] ?? t).join(', ');
}

export default function HardwareTable({
  data,
  loading = false,
  sponsorCompanyId,
  sponsorNameById,
  onRowClick,
  onEdit,
  onCreateDevices,
  getRowId,
  search = true,
  pagination = true,
}: HardwareTableProps): JSX.Element {
  const rows = useMemo(() => {
    if (sponsorCompanyId == null || sponsorCompanyId === '') {
      return data;
    }
    return data.filter((row) => row.sponsor_company === sponsorCompanyId);
  }, [data, sponsorCompanyId]);

  const hideSponsorColumn = Boolean(sponsorCompanyId);

  const columns = useMemo((): ColumnDef<HardwareCount>[] => {
    const cols: ColumnDef<HardwareCount>[] = [
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
      },
      {
        id: 'tags',
        header: 'Tags',
        accessorFn: (row) => formatTags(row.tags),
        cell: ({ row }) => (
          <div className="flex flex-row flex-wrap gap-1 items-center justify-start flex-grow break-words overflow-hidden min-w-40 max-h-10">
            {row.original.tags.map((tag) => (
              <div key={tag} className="text-xs">{formatTags([tag])}</div>
            ))}
          </div>
        ),
      },
    ];

    if (!hideSponsorColumn) {
      cols.push({
        id: 'sponsor',
        header: 'Sponsor',
        cell: ({ row }) => {
          const sid = row.original.sponsor_company;
          if (!sid) return '—';
          return sponsorNameById?.[sid] ?? sid;
        },
      });
    }

    cols.push(
      {
        id: 'available',
        header: 'Available',
        accessorKey: 'available',
      },
      {
        id: 'checked_out',
        header: 'Checked out',
        accessorKey: 'checked_out',
      },
      {
        id: 'total',
        header: 'Total',
        accessorKey: 'total',
      },
    );

    if (onEdit || onCreateDevices) {
      cols.push({
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-row justify-center items-center gap-2">
            {onEdit ? (
              <AppButton
                onClick={() => onEdit(row.original)}
                size="xs"
              >
                Edit
              </AppButton>
            ) : null}
            {onCreateDevices ? (
              <AppButton
                onClick={() => onCreateDevices(row.original)}
                size="xs"
              >
                Add devices
              </AppButton>
            ) : null}
          </div>
        ),
      });
    }

    return cols;
  }, [hideSponsorColumn, sponsorNameById, onEdit, onCreateDevices]);

  return (
    <div className="border border-[#EEEEEE] rounded-xl overflow-hidden max-h-2/3">
      <Table<HardwareCount>
        data={rows}
        columns={columns}
        loading={loading}
        onRowClick={onRowClick}
        search={search}
        pagination={pagination}
        getRowId={getRowId ?? ((row) => row.id ?? '')}
        defaultSorting={[{ id: 'name', desc: false }]}
      />
    </div>
  );
}
