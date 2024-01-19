import React, { useState } from 'react';
import Image from 'next/image';
import { HelpRequest, addMentorHelpRequest } from '@/app/api/helpqueue';
import CustomSelect from '../CustomSelect';
import {
  Autocomplete,
  TextField,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { Select } from 'antd';
import { MentorTopics } from '@/types/types';
import CustomTagRenderer from '../CustomTagRenderer';
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
interface CompletedPostingProps {
  requestTitle: string;
  skillList: string[];
  description: string;
  created: string;
}
export function CompletedPosting({
  requestTitle,
  skillList,
  description,
  created
}: CompletedPostingProps) {
  return (
    <Posting
      completed={true}
      requestTitle={requestTitle}
      skillList={skillList}
      description={description}
      created={created}
    />
  );
}

interface PostingProps {
  status?: string;
  completed?: boolean;
  mentorFirstName?: string;
  mentorLastName?: string;
  requestTitle: string;
  placeInQueue?: number;
  skillList: string[];
  description: string;
  created?: string;
  team?: string;
}

export function Posting({
  status,
  completed,
  mentorFirstName,
  mentorLastName,
  requestTitle,
  placeInQueue,
  skillList,
  description,
  created,
  team
}: PostingProps) {
  return (
    <div className="flex flex-col bg-white border-black border-2  w-fit rounded-lg">
      {team}
      {mentorFirstName && (
        <div className="bg-[#8FC382] w-full p-0 text-white flex flex-row justify-center">
          {mentorFirstName} {mentorLastName && mentorLastName[0]}. is on their
          way
        </div>
      )}

      <div className="bg-[#8FC382] w-full p-0 text-white flex flex-row justify-center">
        Status: {status}
      </div>

      <div className="flex flex-row gap-4 p-4">
        <div className="font-semibold">{requestTitle}</div>
        {placeInQueue && (
          <div>
            {placeInQueue == 0 && <span className="font-bold">NEXT</span>}
            {placeInQueue !== 0 && (
              <span className="font-bold">Place in Queue: {placeInQueue}</span>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="ml-4">
          {created && `Submitted at ${formatTime(created)}`}
        </div>
        <div className="ml-4">
          {created && calculateTimeDifference(created)}
        </div>
        <div className="flex px-4 gap-2">
          {skillList.map((skill, index) => (
            <Skill key={index} skill={skill} />
          ))}
        </div>
        <div className="flex px-4">{description}</div>
        {placeInQueue && (
          <div className="flex flex-col items-center">
            <div className="flex px-4 font-semibold bg-red-200 rounded-lg p-1 hover:cursor-pointer">
              I've been helped
            </div>
            <div className="flex px-4">Cancel Request</div>
          </div>
        )}
      </div>
    </div>
  );
}
interface SkillProps {
  skill: string;
}

export function Skill({ skill }: SkillProps) {
  return (
    <div style={{ backgroundColor: '#59BFDC' }} className="p-1 rounded-md px-2">
      {skill}
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
  onSubmit: () => void;
}

export function QuestionDialog({
  isNewRequestDialogOpen,
  closeNewRequestDialog,
  onSubmit
}: QuestionDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []).slice(0, 3); // Limit to three files
    const imageFiles = files.filter(file => file.type.startsWith('image/')); // Filter only image files
    setSelectedFiles(imageFiles);
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

  const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedOption(e.target.value as string);
  };

  const fileInputRef = React.createRef<HTMLInputElement>();

  const eraseImage = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    setPreviewImage(null); // Reset previewImage state
  };

  const skillOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' }
  ];
  const theme = createTheme({
    components: {
      MuiInputBase: {
        styleOverrides: {
          root: {
            backgroundColor: 'white' // Set the text color to white
          },
          focused: {
            border: 'white'
          }
        }
      }
    }
  });

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
              <CustomTagRenderer />
              {/* <Select
                showSearch
                style={{ width: "100%", border:"black" }}
                placeholder="Search to Select"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '').includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '')
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? '').toLowerCase())
                }
                
                options={Object.keys(MentorTopics).map(key => ({ value: MentorTopics[key as keyof typeof MentorTopics], label: key.replace(/_/g, ' ') }))}
                // options={skillOptions}
              /> */}
              {/* <CustomSelect
                className="rounded-md p-2"
                value={selectedOption ? selectedOption : ''}
                onChange={handleSelectChange}
                options={skillOptions}
              ></CustomSelect> */}
            </div>
            <div className="font-bold">
              Describe your request in detail
              <span className="text-red-400 text-2xl">*</span>:
            </div>
            <textarea
              className="w-full h-20 p-4 rounded-md"
              placeholder="Type your description here"
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
                    <li key={index} onClick={() => handleImageClick(file)}>
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
            onClick={onSubmit}
            className="mt-auto ml-auto py-1 px-2 rounded-xl bg-red-200"
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

function formatTime(datetimeString: string): string {
  const timeWithMilliseconds: string = datetimeString.split('T')[1]; // "02:09:56.806940Z"
  const timePart: string = timeWithMilliseconds.split('.')[0]; // "02:09:56"

  const [hours, minutes]: number[] = timePart.split(':').map(Number);
  const ampm: string = hours >= 12 ? 'PM' : 'AM';
  const formattedTime: string = `${hours % 12 || 12}:${minutes} ${ampm}`;

  return formattedTime;
}

function calculateTimeDifference(dateTimeString: string): string {
  const currentDate = new Date();
  const targetDate = new Date(dateTimeString);

  // Calculate the time difference in milliseconds
  const timeDifference = targetDate.getTime() - currentDate.getTime();

  // Convert milliseconds to hours, minutes, and seconds
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  return `${hours}: ${minutes}: ${seconds}`;
}
