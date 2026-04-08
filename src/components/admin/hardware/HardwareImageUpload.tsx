import Dropzone from '@/components/Dropzone';
import { fixFileLink } from '@/app/api/uploaded_files';

type HardwareImageUploadProps = {
  pendingFile: File | null;
  existingImageUrl: string | null;
  onFileChange: (file: File | null) => void;
};

export default function HardwareImageUpload({
  pendingFile,
  existingImageUrl,
  onFileChange,
}: HardwareImageUploadProps) {
  const previewUrl = pendingFile
    ? URL.createObjectURL(pendingFile)
    : existingImageUrl
    ? fixFileLink(existingImageUrl)
    : null;

  if (previewUrl) {
    return (
      <div className="flex flex-col items-center gap-2">
        <img
          src={previewUrl}
          alt="Hardware preview"
          className="rounded-xl max-h-48 object-contain"
        />
        <button
          type="button"
          onClick={() => onFileChange(null)}
          className="text-sm text-blue-600 underline"
        >
          Replace image
        </button>
      </div>
    );
  }

  return (
    <Dropzone
      acceptedFiles={[]}
      rejectedFiles={[]}
      setAcceptedFiles={(files) => {
        const resolved = typeof files === 'function' ? files([]) : files;
        onFileChange(resolved[0] ?? null);
      }}
      setRejectedFiles={() => {}}
    />
  );
}
