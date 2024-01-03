/* eslint-disable no-console */
import { formatBytes } from '@/app/utils/utils';
import { form_data } from '@/types/application_form_types';
import { FileRejection, useDropzone } from 'react-dropzone';

type AcceptedFile = {
  file: File;
  path: string;
  size: number;
};

interface FormProps {
  setFormData?: React.Dispatch<React.SetStateAction<Partial<form_data>>>;
  acceptedFiles: File[];
  setAcceptedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  rejectedFiles: File[];
  setRejectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const Dropzone: React.FC<FormProps> = ({
  setFormData,
  acceptedFiles,
  setAcceptedFiles,
  rejectedFiles,
  setRejectedFiles
}) => {
  function handleUpload(data: File[]) {
    const file = data[0];
    if (file && setFormData) {
      setFormData(prevFormData => ({
        ...prevFormData
      }));
    }
  }

  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    handleUpload(acceptedFiles);
    setAcceptedFiles(acceptedFiles);
    setRejectedFiles(fileRejections.map(rejection => rejection.file));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    }
  });

  const acceptedFileItems = (acceptedFiles ? acceptedFiles : []).map(file => {
    const customFile: AcceptedFile = {
      file,
      path: file.name,
      size: file.size
    };
    return (
      <span key={customFile.path}>
        {customFile.path} - {formatBytes(customFile.size)}
      </span>
    );
  });

  const fileRejectionItems = (rejectedFiles ? rejectedFiles : []).map(file => {
    const customFile: AcceptedFile = {
      file,
      path: file.name,
      size: file.size
    };
    return (
      <span key={customFile.path}>
        {customFile.path} - {formatBytes(customFile.size)}
      </span>
    );
  });

  return (
    <section>
      <div
        {...getRootProps()}
        className="flex justify-center px-8 py-16 my-4 mt-2 align-middle transition border border-gray-300 border-dashed rounded-lg outline-none focus:border-themePrimary align-center"
      >
        <input {...getInputProps()} />
        <div className="text-center cursor-default ">
          <div className="mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={44}
              height={44}
              fill="none"
              className="mx-auto mb-2"
            >
              <circle cx={22} cy={22} r={22} fill="#c3c3c3" fillOpacity={0.2} />
              <path
                fill="#4e1fdd"
                d="M25.733 27.976h-2.47v-7.721c0-.14-.12-.255-.267-.255h-2a.262.262 0 0 0-.266.255v7.72h-2.463c-.223 0-.346.246-.21.412l3.733 4.515a.276.276 0 0 0 .42 0l3.733-4.515c.136-.166.013-.411-.21-.411Z"
              />
              <path
                fill="#4e1fdd"
                d="M31.356 17.546C29.925 13.72 26.278 11 22.006 11c-4.272 0-7.918 2.717-9.35 6.542C9.978 18.255 8 20.728 8 23.667 8 27.166 10.797 30 14.247 30H15.5c.137 0 .25-.114.25-.253v-1.9a.252.252 0 0 0-.25-.254h-1.253a3.828 3.828 0 0 1-2.781-1.194 3.954 3.954 0 0 1-1.091-2.869 3.928 3.928 0 0 1 2.884-3.667l1.185-.313.434-1.159a7.647 7.647 0 0 1 1.116-2.008 7.72 7.72 0 0 1 1.637-1.58 7.497 7.497 0 0 1 4.375-1.4c1.578 0 3.09.485 4.375 1.4a7.724 7.724 0 0 1 2.753 3.588l.432 1.156 1.18.316c1.695.463 2.879 2.024 2.879 3.804a3.93 3.93 0 0 1-2.39 3.63c-.47.197-.973.298-1.482.296H28.5a.252.252 0 0 0-.25.254v1.9c0 .139.113.253.25.253h1.253C33.203 30 36 27.166 36 23.667c0-2.936-1.972-5.406-4.644-6.122Z"
              />
            </svg>
          </div>
          <span className="font-semibold text-themePrimary">
            Click to upload{' '}
          </span>
          <span>or drag and drop</span>
          <br />
          <span>.png, .jpeg, .gif</span>
        </div>
      </div>
      <div className="mb-4 ">
        {acceptedFileItems.length !== 0 && (
          <div className="flex flex-row items-center ">
            <span>Accepted: {acceptedFileItems}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              className="w-4 h-4 ml-2"
            >
              <path
                fill="#43a047"
                d="M32 2C15.431 2 2 15.432 2 32c0 16.568 13.432 30 30 30 16.568 0 30-13.432 30-30C62 15.432 48.568 2 32 2zm-6.975 48-.02-.02-.017.02L11 35.6l7.029-7.164 6.977 7.184 21-21.619L53 21.199 25.025 50z"
              />
            </svg>
          </div>
        )}
        {fileRejectionItems.length !== 0 && (
          <span>Rejected: {fileRejectionItems}</span>
        )}
      </div>
    </section>
  );
};

export default Dropzone;
