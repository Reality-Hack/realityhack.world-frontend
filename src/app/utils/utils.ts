type FileBlobManager = {
  file: File | null;
  blob: string | null;
};

let fileBlobManager: FileBlobManager = {
  file: null,
  blob: null
};

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function setFile(fl: File, bl: string): void {
  fileBlobManager.file = fl;
  fileBlobManager.blob = bl;
}
