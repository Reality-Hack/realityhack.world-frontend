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
        case "REQUESTED": return gray;
        case "ACKNOWLEDGED": return yellow;
        case "EN_ROUTE": return green;
        case "RESOLVED": return offwhite;
  
      }
    }
      
    return (
      <div className="flex flex-col bg-white border-black border-2  w-fit rounded-lg">
        {team}
        {mentorFirstName && (
          <div className="bg-[#8FC382] w-full p-0 text-white flex flex-row justify-center">
            {mentorFirstName} {mentorLastName && mentorLastName[0]}. is on their
            way
          </div>
        )}
  
        <div className={`${bannerColor(status)} w-full p-0 flex flex-row justify-center`}>
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
      <div style={{ backgroundColor: '#59BFDC' }} className="p-1 rounded-md px-2">
        {skill}
      </div>
    );
  }
  