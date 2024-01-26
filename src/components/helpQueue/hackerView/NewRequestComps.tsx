import React, { useState } from 'react';
import Image from 'next/image';
import { HelpRequest, addMentorHelpRequest } from '@/app/api/helpqueue';
import { ThemeProvider, createTheme } from '@mui/material';
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
    <div className="flex flex-row gap-2 p-6 bg-white border-2 border-black rounded-lg w-fit drop-shadow-2xl">
      <Image src={src} alt={label} height={4} width={50} />
      <div className="flex flex-col">
        <div>{label}</div>
        <div className="text-4xl font-bold">{stat}</div>
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
      <div className="w-1/2 p-4 overflow-y-auto bg-gray-300 rounded-md shadow-md h-1/2">
        <div className="flex">
          <button className="ml-auto " onClick={onClose}>
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

  // const formattedOptions = Object.values(MentorTopics).map(
  //   (key: any, value: any) => ({
  //     label: key.replace(/_/g, ' '),
  //     value: MentorTopics[key as keyof typeof MentorTopics]
  //   })
  // );

  const formattedOptions = [];

  for (const key in MentorTopics) {
    formattedOptions.push({
      label: key.replace(/_/g, ' '),
      value: MentorTopics[key as keyof typeof MentorTopics]
    });
  }

  console.log('formattedOptions: ', formattedOptions);
  // console.log('MentorTopics: ', MentorTopics);

  const theme = createTheme({
    components: {
      MuiInputBase: {
        styleOverrides: {
          root: {
            '&.Mui-focused': {
              border: 'white'
            }
          }
        }
      }
    }
  });

  const [selectedItems, setSelectedItems] = useState<string[]>([]); // New state variable

  // console.log('selectedItems: ', selectedItems);

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        isOpen={isNewRequestDialogOpen}
        onClose={() => {
          closeNewRequestDialog();
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="text-md md:text-2xl font-bold whitespace-nowrap">
            New Help Request
          </div>
          <div className="flex flex-col gap-4">
            <div className="font-bold">
              What do you need help with
              <span className="text-lg md:text-2xl text-red-400">*</span>?
            </div>
            <div className="w-40">
              {/* tag renderer with a custom dropdown */}
              <SelectToolWithOther
                canSubmit={setCanSubmit}
                mentorTopics={formattedOptions.map(option => option.label)}
                placeholder={'Select Your Skill'}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                formattedOptions={formattedOptions}
              />
            </div>
            <div className="font-bold">
              Describe your request in detail
              <span className="text-2xl text-red-400">*</span>:
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
