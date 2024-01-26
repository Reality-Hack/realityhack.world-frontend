import { editMentorHelpRequest } from '@/app/api/helpqueue';
import { useEffect, useState } from 'react';

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
  const bannerColor = (status: string) => {
    const green = 'bg-[#8FC382] text-white';
    const yellow = 'bg-[#F9C34A] text-black';
    const gray = 'bg-[#D1D5DB] text-black';
    const offwhite = 'bg-[#fff9e8] text-grey';
    switch (status) {
      case 'REQUESTED':
        return gray;
      case 'ACKNOWLEDGED':
        return yellow;
      case 'EN_ROUTE':
        return green;
      case 'RESOLVED':
        return offwhite;
    }
  };

  const [remainingTime, setRemainingTime] = useState<string | null>(null);

  useEffect(() => {
    // Calculate the initial remaining time
    const initialRemainingTime = calculateTimeDifference(created);

    // Update the state with the initial remaining time
    setRemainingTime(initialRemainingTime);

    // Set up an interval to update the remaining time every second
    const intervalId = setInterval(() => {
      const updatedRemainingTime = calculateTimeDifference(created);

      // Update the state with the latest remaining time
      setRemainingTime(updatedRemainingTime);
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [created]);

  return (
    <div className="flex flex-col bg-white border-black rounded-lg shadow-md w-[300px]">
      <div className="h-2 w-full bg-[#4D97E8] rounded-t-lg" />
      {/* {team} */}
      {mentorFirstName && (
        <div className="bg-[#8FC382] w-full p-0 text-white flex flex-row justify-center">
          {mentorFirstName} {mentorLastName && mentorLastName[0]}. is on their
          way
        </div>
      )}

      <div
        className={`${bannerColor(status)} w-full p-0 mt-4 flex flex-row justify-center`}
      >
        Status: {status}
      </div>

      <div className="flex flex-row gap-4 p-4 mx-auto">
        {/* <div className="font-semibold">{requestTitle}</div> */}
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
        <div className="mx-auto text-xs">
          {created && `Submitted at ${formatTime(created)}`}
        </div>
        <div className="mx-auto">
          {created && calculateTimeDifference(created)}
        </div>
        <div className="flex flex-wrap items-center justify-center w-full gap-2 px-4">
          {skillList.map((skill, index) => (
            <Skill key={index} skill={skill} />
          ))}
        </div>
        <div className="flex px-4">{description}</div>
        {placeInQueue && (
          <div className="flex flex-col items-center">
            <div className="gap-1.5s flex mt-0 mb-4 bg-[#1677FF] text-white px-4 py-[6px] rounded-md shadow my-4 font-light text-sm hover:bg-[#0066F5] cursor-pointer transition-all">
              I've been helped
            </div>
            <div className="gap-1.5s flex mt-0 mb-4 border border-[#0066F5] px-4 py-[6px] text-[#0066F5] rounded-md shadow my-4 font-light text-sm cursor-pointer transition-all">
              Cancel Request
            </div>
          </div>
        )}
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

interface SkillProps {
  skill: string;
}

export function Skill({ skill }: SkillProps) {
  return (
    <div
      style={{ backgroundColor: '#4D97E8' }}
      className="p-1 px-2 text-xs text-white rounded-md whitespace-nowrap"
    >
      {skill}
    </div>
  );
}

interface MentorPostingProps {
  access_token: string;
  requestId: string;
  status?: string;
  completed?: boolean;
  mentorFirstName?: string;
  mentorLastName?: string;
  requestTitle: string;
  placeInQueue?: number;
  topicList: string[];
  description: string;
  created?: string;
  team?: string;
}

export function MentorPosting({
  access_token,
  requestId,
  status,
  completed,
  mentorFirstName,
  mentorLastName,
  requestTitle,
  placeInQueue,
  topicList,
  description,
  created,
  team
}: MentorPostingProps) {
  const bannerColor = (status: string) => {
    const green = 'bg-[#8FC382] text-white';
    const yellow = 'bg-[#F9C34A] text-black';
    const gray = 'bg-[#D1D5DB] text-black';
    const offwhite = 'bg-[#fff9e8] text-grey';
    switch (status) {
      case 'REQUESTED':
        return gray;
      case 'ACKNOWLEDGED':
        return yellow;
      case 'EN_ROUTE':
        return green;
      case 'RESOLVED':
        return offwhite;
    }
  };

  function handleUpdate(status: string) {
    console.log(status);
    const updateData = {
      team: team,
      topic: topicList,
      status: status
    };
    editMentorHelpRequest(access_token, requestId, updateData);
  }

  return (
    <div className="flex flex-col bg-white border-2 border-black rounded-lg w-fit">
      {team}
      {mentorFirstName && (
        <div className="bg-[#8FC382] w-full p-0 text-white flex flex-row justify-center">
          {mentorFirstName} {mentorLastName && mentorLastName[0]}. is on their
          way
        </div>
      )}

      {status && (
        <div
          className={`${bannerColor(status)} w-full p-0 flex flex-row justify-center`}
        >
          Status: {status}
        </div>
      )}

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
        <div className="flex gap-2 px-4">
          {topicList.map((skill, index) => (
            <Skill key={index} skill={skill} />
          ))}
        </div>
        <div className="flex px-4">{description}</div>
        {status == 'REQUESTED' && (
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex flex-col items-center justify-center gap-2">
              <div
                onClick={() => handleUpdate('A')}
                className="flex px-4 font-semibold bg-[#F9C34A] text-black rounded-lg p-1 hover:opacity-60 drop-shadow-lg hover:cursor-pointer"
              >
                Acknowledge
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div
                onClick={() => handleUpdate('E')}
                className={`flex px-4 font-semibold bg-[#8FC382] text-white rounded-lg p-1 hover:opacity-60 drop-shadow-lg hover:cursor-pointer`}
              >
                On My Way
              </div>
            </div>
          </div>
        )}
        {status == 'ACKNOWLEDGED' && (
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex flex-col items-center justify-center gap-2">
              <div
                onClick={() => handleUpdate('R')}
                className="flex px-4 font-semibold bg-[#D1D5DB] text-black rounded-lg p-1 hover:opacity-60 drop-shadow-lg hover:cursor-pointer"
              >
                Unacknowledge
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div
                onClick={() => handleUpdate('E')}
                className={`flex px-4 font-semibold bg-[#8FC382] text-white rounded-lg p-1 hover:opacity-60 drop-shadow-lg hover:cursor-pointer`}
              >
                On My Way
              </div>
            </div>
          </div>
        )}
        {status == 'EN_ROUTE' && (
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex flex-col items-center justify-center gap-2">
              <div
                onClick={() => handleUpdate('R')}
                className="flex p-1 px-4 font-semibold bg-white border-2 border-black rounded-lg hover:opacity-60 drop-shadow-lg hover:cursor-pointer"
              >
                Let question go
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div
                onClick={() => handleUpdate('F')}
                className={`flex px-4 font-semibold bg-[#fff9e8] text-grey rounded-lg p-1 hover:opacity-60 drop-shadow-lg hover:cursor-pointer`}
              >
                Resolve
              </div>
            </div>
          </div>
        )}
        {/* {placeInQueue && (
            <div className="flex flex-col items-center">
              <div className="flex p-1 px-4 font-semibold bg-red-200 rounded-lg hover:cursor-pointer">
              Acknowledge
              </div>
            
            </div>
          )}
          {placeInQueue && (
            <div className="flex flex-col items-center mb-2">
              <div className="flex p-1 px-4 font-semibold bg-red-200 rounded-lg hover:cursor-pointer">
              On my way
              </div>
            </div>
          )} */}
      </div>
    </div>
  );
}
