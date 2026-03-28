import { useState } from 'react';
import { form_data } from '@/types/application_form_types';

function toCSV(rows: Record<string, unknown>[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v == null ? '' : String(v);
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  return [
    headers.map(escape).join(','),
    ...rows.map(row => headers.map(h => escape(row[h])).join(',')),
  ].join('\n');
}

export async function exportToCsv(
  applications: form_data[] | any,
  fileName: string
) {
  try {
    const csv = toCSV(applications as Record<string, unknown>[]);
    downloadFile(
      fileName,
      new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    );
  } catch (err) {
    console.error(err);
  }
}

export function ExportButton({
  onExport,
  children,
  disabled,
}: {
  onExport: () => Promise<unknown>;
  children: any;
  disabled?: boolean;
}) {
  const [exporting, setExporting] = useState(false);

  return (
    <button
      className="gap-1.5s flex mt-0 mb-4 bg-[#1677FF] text-white px-4 py-[6px] rounded-md shadow my-4 font-light text-sm hover:bg-[#0066F5] transition-all"
      disabled={exporting || disabled}
      onClick={async () => {
        setExporting(true);
        await onExport();
        setExporting(false);
      }}
    >
      {exporting ? 'Exporting' : children}
    </button>
  );
}

function downloadFile(fileName: string, data: Blob) {
  const downloadLink = document.createElement('a');
  downloadLink.download = fileName;
  const url = URL.createObjectURL(data);
  downloadLink.href = url;
  downloadLink.click();
  URL.revokeObjectURL(url);
}
