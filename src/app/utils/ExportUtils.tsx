import { useState } from 'react';
import { form_data } from '@/types/application_form_types';
import { Parser } from 'json2csv';

export async function exportToCsv(
  applications: form_data[] | any,
  fileName: string
) {
  try {
    const parser = new Parser();
    const csv = parser.parse(applications);
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
  children
}: {
  onExport: () => Promise<unknown>;
  children: any;
}) {
  const [exporting, setExporting] = useState(false);

  return (
    <button
      className="gap-1.5s flex mt-0 mb-4 bg-[#1677FF] text-white px-4 py-[6px] rounded-md shadow my-4 font-light text-sm hover:bg-[#0066F5] transition-all"
      disabled={exporting}
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
