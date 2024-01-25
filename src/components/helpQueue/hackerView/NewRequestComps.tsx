import React, { useState } from 'react';
import Image from 'next/image';
import { HelpRequest, addMentorHelpRequest } from '@/app/api/helpqueue';
import {  ThemeProvider,  createTheme} from '@mui/material';
import { MentorTopics } from '@/types/types';
import SelectToolWithOther from '@/app/(dashboard)/mentors/SelectToolWithOther';
import { useAuthContext } from '@/hooks/AuthContext';

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
    team: string,
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
  //this is to see if you can submit the question or not
  const [canSubmit, setCanSubmit] = useState<boolean>(false);

  const { user } = useAuthContext();

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
          </div>
          <div
            onClick={() => {
              if (!user || !user.team) {
                console.error('User or team is null');
                return;
              }
              if (textareaValue.trim() !== '' && canSubmit) {
                onSubmit(selectedItems, user?.team?.id, textareaValue);
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

