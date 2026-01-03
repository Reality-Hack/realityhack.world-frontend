import SelectToolWithOther from '@/app/(dashboard)/mentors/SelectToolWithOther';
import { useAuth } from '@/contexts/AuthContext';
import { MentorTopics } from '@/types/types';
import { ThemeProvider, createTheme } from '@mui/material';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

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
      e.stopPropagation();
      onClose();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center z-[1002]"
        onClick={handleDialogClick}
      >
        <div className="relative w-[720px] max-h-[600px] p-4 bg-white rounded-md shadow-md">
          <div className="flex">
            <button className="ml-auto " onClick={onClose}>
              Close
            </button>
          </div>
          <div>{children}</div>
        </div>
      </div>
      <div className="fixed inset-0 bg-black/30 z-[1001]" aria-hidden="true" />
    </>
  );
}

interface QuestionDialogProps {
  isNewRequestDialogOpen: boolean;
  closeNewRequestDialog: () => void;
  onSubmit: (
    topics: string[],
    team: string,
    description?: string,
    reporter_location?: string,
    reporter?: string,
    category?: string,
    category_specialty?: string
  ) => void;
  setShowCompletedRequests: any;
}

export function QuestionDialog({
  isNewRequestDialogOpen,
  closeNewRequestDialog,
  onSubmit
}: QuestionDialogProps) {
  const { user } = useAuth();
  const formattedOptions = [];
  const [descriptionText, setDescriptionText] = useState<string>('');
  const [locations, setLocations] = useState<string>('');
  const [canSubmit, setCanSubmit] = useState<boolean>(false);

  for (const key in MentorTopics) {
    formattedOptions.push({
      label: key.replace(/_/g, ' '),
      value: MentorTopics[key as keyof typeof MentorTopics]
    });
  }

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

  const handleOnSubmit = async () => {
    if (!user || !user.team) {
      toast.error('User or team is null');
      return;
    }
    if (selectedItems.length < 1) {
      toast.error('select at least one topic');
      return;
    }
    if (descriptionText.trim() !== '' && canSubmit) {
      try {
        // Assuming onSubmit is a Promise. If not, adjust accordingly.
        await onSubmit(
          selectedItems,
          user?.team?.id,
          descriptionText,
          locations
        ); // Pass locations
        setDescriptionText('');
        setSelectedItems([]);
        setCanSubmit(false);
        setLocations(''); // Clear location text after submission
        closeNewRequestDialog(); // Close the dialog on successful submission
      } catch (error) {
        // Handle any errors here
        console.error('Error submitting the request:', error);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        isOpen={isNewRequestDialogOpen}
        onClose={() => {
          closeNewRequestDialog();
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="text-md md:text-xl whitespace-nowrap">
            New Help Request
          </div>
          <div className="flex flex-col gap-4">
            {/* Select Help Topic */}

            <div className="font-medium">
              What do you need help with?
              <span className="mb-2 text-red-400 text-md">&nbsp;*</span>
            </div>
            <div className="w-full">
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
            {/* Description */}

            <div className="font-medium">
              Describe your request in detail:
              <span className="mb-2 text-red-400 text-md">&nbsp;*</span>
            </div>
            <textarea
              className="w-full h-20 p-2 border border-[#d9d9d9] rounded-md focus:outline-none focus:border-[#4096ff] hover:border-[#4096ff] transition-all"
              placeholder="Type your description here"
              value={descriptionText}
              onChange={e => setDescriptionText(e.target.value)}
            />
            {/* Pre-filled location */}
            <div className="font-medium">
              Where can mentors find you if not at your table?
            </div>
            <input
              type="text"
              value={locations}
              onChange={e => setLocations(e.target.value)} // Allow user to overwrite
              placeholder="Building, Room, Table"
              className="w-full p-2 border border-[#d9d9d9] rounded-md focus:outline-none focus:border-[#4096ff] hover:border-[#4096ff] transition-all"
            />
          </div>
          {/*Submit*/}
          <div
            onClick={handleOnSubmit}
            className={`gap-1.5s mr-6 flex mt-0 mb-4 text-white px-4 py-[6px] rounded-md shadow my-4 font-light text-sm cursor-pointer transition-all w-fit whitespace-nowrap ${
              descriptionText.trim() !== '' && selectedItems.length >= 1
                ? 'hover:bg-[#0066F5] bg-[#1677FF] cursor-pointer'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Submit Help Request
          </div>
        </div>
      </Dialog>
    </ThemeProvider>
  );
}
