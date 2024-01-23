import React, { useState } from 'react';
import Image from 'next/image';
import { HelpRequest, addMentorHelpRequest } from '@/app/api/helpqueue';
import {  ThemeProvider,  createTheme} from '@mui/material';
import { MentorTopics } from '@/types/types';
import SelectToolWithOther from '@/app/(dashboard)/mentors/SelectToolWithOther';
interface StatBoxProps {
  src: string;
  label: string;
  stat: string;
}

export function StatBox({ src, label, stat }: StatBoxProps) {
  return (
    <div className="flex flex-row bg-white w-fit drop-shadow-2xl p-6 gap-2 rounded-lg border-black border-2">
      <Image src={src} alt={label} height={4} width={50} />
      <div className="flex flex-col">
        <div>{label}</div>
        <div className="font-bold text-4xl">{stat}</div>
      </div>
    </div>
  );
}

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children?: any;
}

export function Dialog({ isOpen, onClose, children }: DialogProps) {
  if (!isOpen) {
    return null;
  }

  const handleDialogClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close the dialog only if the click is outside the inner dialog content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      onClick={handleDialogClick}
    >
      <div className="bg-gray-300 w-1/2 h-1/2 p-4 rounded-md shadow-md overflow-y-auto">
        <div className="flex">
          <button className=" ml-auto" onClick={onClose}>
            Close
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

interface QuestionDialogProps {
  isNewRequestDialogOpen: boolean;
  closeNewRequestDialog: () => void;
  onSubmit: (
    topics: string[],
    description?: string,
    reporter?: string,
    category?: string,
    category_specialty?: string
  ) => void;
}

export function QuestionDialog({
  isNewRequestDialogOpen,
  closeNewRequestDialog,
  onSubmit
}: QuestionDialogProps) {
  const [textareaValue, setTextareaValue] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  //this is to see if you can submit the question or not
  const [canSubmit, setCanSubmit] = useState<boolean>(false);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []).slice(0, 3); // Limit to three files
    const imageFiles = files.filter(file => file.type.startsWith('image/')); // Filter only image files
    setSelectedFiles(imageFiles);
  };

  const handleDeletePreview = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    setPreviewImage(null); // Reset previewImage state
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 3); // Limit to three files
    const imageFiles = files.filter(file => file.type.startsWith('image/')); // Filter only image files
    setSelectedFiles(prevFiles => [...imageFiles, ...prevFiles].slice(0, 3));
    setPreviewImage(null); // Reset previewImage state
  };

  const handleImageClick = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  const fileInputRef = React.createRef<HTMLInputElement>();

  const eraseImage = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    setPreviewImage(null); // Reset previewImage state
  };

  const formattedOptions = Object.keys(MentorTopics).map(key =>
    key.replace(/_/g, ' ')
  );
  const theme = createTheme({
    components: {
      MuiInputBase: {
        styleOverrides: {
          "root": {
            "&.Mui-focused": {
              "border": "white"
            }
          }
        }
      }
    }
  });

    const [selectedItems, setSelectedItems] = useState<string[]>([]); // New state variable

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        isOpen={isNewRequestDialogOpen}
        onClose={() => {
          closeNewRequestDialog();
          setPreviewImage(null);
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="text-2xl font-bold">New Help Request</div>
          <div className="flex flex-col gap-4">
            <div className="font-bold">
              What do you need help with
              <span className="text-red-400 text-2xl">*</span>?
            </div>
            <div className="w-full">
              {/* tag renderer with a custom dropdown */}
              <SelectToolWithOther
                canSubmit={setCanSubmit}
                mentorTopics={formattedOptions}
                placeholder={'Select Your Skill'}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
            </div>
            <div className="font-bold">
              Describe your request in detail
              <span className="text-red-400 text-2xl">*</span>:
            </div>
            <textarea
              className="w-full h-20 p-4 rounded-md"
              placeholder="Type your description here"
              value={textareaValue}
              onChange={e => setTextareaValue(e.target.value)}
            />
            <div className="font-bold">Add up to three screenshots</div>
            <div
              className="border-dashed border-2 p-4 cursor-pointer rounded-md"
              onDragOver={e => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={handleFileClick}
            >
              Drag and drop or click to upload
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              multiple
              onChange={handleFileInputChange}
            />
            {selectedFiles.length > 0 && (
              <div className="mt-2">
                <strong>Selected files:</strong>
                <ul className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                 
                 <li className='flex flex-row gap-2' key={index} onClick={() => handleImageClick(file)}>
                      <button className="bg-red-400 text-white rounded-lg p-2" onClick={() => handleDeletePreview(index)}>
                X
              </button>
                      <SelectedFile
                        fileTitle={file.name}
                        eraseImage={() => eraseImage(index)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <strong>Preview:</strong>
            {previewImage && (
              <div className="">
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '200px' }}
                />
              </div>
            )}
          </div>
          <div
            onClick={() => {
              if (textareaValue.trim() !== '' && canSubmit) {
                onSubmit(selectedItems, textareaValue);
              }
            }}            
          className={`mt-auto ml-auto py-1 px-2 rounded-xl ${
              textareaValue.trim() !== '' && canSubmit
                ? 'bg-green-200 cursor-pointer'
                : 'bg-red-200 cursor-not-allowed'
            }`}
          >
            Submit Help Request
          </div>
        </div>
      </Dialog>
    </ThemeProvider>
  );
}

export function SelectedFile({
  fileTitle,
  eraseImage
}: {
  fileTitle: string;
  eraseImage: () => void;
}) {
  // Split fileTitle into title and type
  const title =
    fileTitle.length > 7 ? `${fileTitle.slice(0, 7)}...` : fileTitle;
  const fileType = fileTitle.substring(fileTitle.lastIndexOf('.') + 1);

  return (
    <div className="flex gap-2 w-fit border p-1 rounded-lg items-center bg-gray-100">
      <div className="ml-auto" onClick={eraseImage}>
        <Image alt="y" src={'/CloseX.png'} width={15} height={15} />
      </div>
      <div>
        {title}.{fileType}
      </div>
    </div>
  );
}

