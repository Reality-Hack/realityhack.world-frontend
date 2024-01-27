import {
  editMentorHelpRequest,
  deleteMentorHelpRequest
} from '@/app/api/helpqueue';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { DateTime } from 'luxon';

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

const statusCodeMap = {
  R: 'Requested',
  A: 'Acknowledged',
  E: 'En Route',
  F: 'Resolved'
};

const getStatusLabel = (statusCode: any) => {
  return statusCodeMap[statusCode as keyof typeof statusCodeMap] || statusCode;
};

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
  requestId?: string;
  setShowCompletedRequests?: React.Dispatch<React.SetStateAction<number>>;
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
  team,
  requestId,
  setShowCompletedRequests
}: PostingProps) {
  const { data: session } = useSession();

  const bannerColor = (status: string | void) => {
    const green = 'bg-[#8FC382] text-white';
    const yellow = 'bg-[#F9C34A] text-black';
    const gray = 'bg-[#D1D5DB] text-black';
    const offwhite = 'bg-[#fff9e8] text-grey';
    switch (status) {
      case 'R':
        return gray;
      case 'A':
        return yellow;
      case 'E':
        return green;
      case 'F':
        return offwhite;
    }
    return offwhite;
  };

  const [remainingTime, setRemainingTime] = useState<string | null>(null);

  useEffect(() => {
    // Function to update the remaining time
    const updateRemainingTime = () => {
      const updatedRemainingTime = calculateTimeDifference(created ?? '');
      setRemainingTime(updatedRemainingTime);
    };

    // Calculate and set the initial remaining time
    updateRemainingTime();

    // Set up an interval to update the remaining time every second
    const intervalId = setInterval(updateRemainingTime, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [created]); // Dependency on 'created'

  function formatTime(datetimeString: string): string {
    const dateTime = DateTime.fromISO(datetimeString);

    if (!dateTime.isValid) {
      return 'Invalid date';
    }

    // Format the time in AM/PM format
    return dateTime.toLocaleString(DateTime.TIME_SIMPLE);
  }

  function handleDelete() {
    if (!session?.access_token || !requestId) return;

    deleteMentorHelpRequest(session.access_token, requestId)
      .then(response => {})
      .catch(error => {
        console.error('Error deleting request:', error);
      })
      .finally(() => {
        if (setShowCompletedRequests) {
          setShowCompletedRequests(trigger => (trigger ?? 0) + 1);
        }
      });
  }

  function handleStatusUpdate(status: string) {
    if (!session?.access_token || !requestId) return;

    const updateData = {
      status: status
    };
    editMentorHelpRequest(session.access_token, requestId, updateData)
      .then(response => {})
      .catch(error => {
        console.error('Error updating request:', error);
      })
      .finally(() => {
        if (setShowCompletedRequests) {
          setShowCompletedRequests(trigger => (trigger ?? 0) + 1);
        }
      });
  }

  return (
    <div className="flex flex-col bg-white border-black rounded-lg shadow-md w-[300px] h-auto">
      {/* <div className="h-2 w-full bg-[#4D97E8] rounded-t-lg" /> */}
      {/* {team} */}
      {mentorFirstName && (
        <div className="bg-[#8FC382] w-full p-0 text-white flex flex-row justify-center">
          {mentorFirstName} {mentorLastName && mentorLastName[0]}. is on their
          way
        </div>
      )}
      <div
        className={`${bannerColor(status)} w-full p-0 flex flex-row justify-center`}
      >
        Status: {getStatusLabel(status)}
      </div>

      <div className="flex flex-row gap-4 p-4 mx-auto">
        {/* <div className="font-semibold">{requestTitle}</div> */}
        {placeInQueue && (
          <div>
            {placeInQueue === 0 && <span className="font-bold">NEXT</span>}
            {placeInQueue !== 0 && (
              <span className="font-bold">Place in Queue: {placeInQueue}</span>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col justify-end gap-2">
        <div className="mx-auto text-xs">
          {created &&
            `Submitted at ${DateTime.fromISO(created).toLocaleString(DateTime.DATETIME_SHORT)}`}
        </div>
        <div className="mx-auto">
          {created && calculateTimeDifference(created)}
        </div>
        <div className="flex flex-wrap items-center justify-center w-full gap-2 px-4">
          {skillList.map((skill, index) => (
            <Skill key={index} skill={skill} />
          ))}
        </div>
        <div className="flex px-4 h-[100px] overflow-auto">{description}</div>
        <div className="flex flex-col items-center mt-8">
          <div
            onClick={() => handleStatusUpdate(status === 'F' ? 'R' : 'F')}
            className="gap-1.5s flex mt-0 mb-4 bg-[#1677FF] text-white px-4 py-[6px] rounded-md shadow my-4 font-light text-sm hover:bg-[#0066F5] cursor-pointer transition-all"
          >
            {status !== 'F' ? `I've been helped` : 'I still need help'}
          </div>
          <div
            onClick={handleDelete}
            className="gap-1.5s flex mt-0 mb-4 border border-[#0066F5] px-4 py-[6px] text-[#0066F5] rounded-md shadow my-4 font-light text-sm cursor-pointer transition-all"
          >
            Cancel Request
          </div>
        </div>
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
  const currentDate = DateTime.now();
  const targetDate = DateTime.fromISO(dateTimeString);

  if (!targetDate.isValid) {
    return 'Invalid date';
  }

  let timeDifference;
  if (currentDate < targetDate) {
    timeDifference = targetDate.diff(currentDate, [
      'hours',
      'minutes',
      'seconds'
    ]);
  } else {
    timeDifference = currentDate.diff(targetDate, [
      'hours',
      'minutes',
      'seconds'
    ]);
  }

  const formattedTimeDifference = timeDifference.toFormat('hh:mm:ss');
  return formattedTimeDifference;
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
    const updateData = {
      team: team,
      topic: topicList,
      status: status
    };
    const apiReturn = editMentorHelpRequest(
      access_token,
      requestId,
      updateData
    );
  }

  return (
    <div className="flex flex-col bg-white border-2 border-black rounded-lg w-fit">
      {/* {team} */}
      {mentorFirstName && (
        <div className="bg-[#8FC382] w-full p-0 text-white flex flex-row justify-center">
          {mentorFirstName} {mentorLastName && mentorLastName[0]}. is on their
          way
        </div>
      )}

      {status && (
        <div
          className={`${bannerColor(status)} flex flex-row justify-center overflow-hidden mt-1 transition-all duration-500 ease-in-out`}
        >
          Status: {getStatusLabel(status)}
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
          {topicList?.map((skill, index) => (
            <Skill key={index} skill={skill} />
          ))}
        </div>
        <div className="flex px-4">{description}</div>
        {status == 'R' && (
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
        {status == 'A' && (
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
        {status == 'E' && (
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
