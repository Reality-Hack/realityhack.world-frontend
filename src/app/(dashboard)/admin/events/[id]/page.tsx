import { useSession } from '@/auth/client';
import { 
  useEventsList,
  eventsActivateCreate,
  useApplicationquestionsList,
  useEventtracksList,
  useEventdestinyhardwareList,
} from '@/types/endpoints'
import { ApplicationQuestion, ApplicationQuestionChoice, Event, EventDestinyHardware, EventTrack } from '@/types/models'
import { DateTime } from 'luxon';
import Loader from '@/components/Loader';
import { toast } from 'sonner';
import { useAppParams } from '@/routing';
import { useMemo, useState } from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const isEventsEnabled = import.meta.env.VITE_IS_EVENTS_ENABLED === 'true';
export default function EventsAdminPage() {
  const { id: eventId = '' } = useAppParams();
  const { data: session } = useSession();
  const [showThematicQuestions, setShowThematicQuestions] = useState(false);
  const [showEventTracks, setShowEventTracks] = useState(false);
  const [showEventHardware, setShowEventHardware] = useState(false);

	const { 
    data: events, 
    isLoading: isLoadingEvents,
    mutate: mutateEvents
  } = useEventsList({ id: eventId }, {
		swr: { enabled: !!session?.access_token },
	})

  const { 
    data: thematicQuestions, 
    isLoading: isThematicQuestionsLoading, 
    error: thematicQuestionsError,
    mutate: mutateThematicQuestions
  } = useApplicationquestionsList({ event: eventId });

  const {
    data: eventTracks,
    isLoading: isEventTracksLoading,
    error: eventTracksError,
    mutate: mutateEventTracks
  } = useEventtracksList({ event: eventId });

  const {
    data: eventHardware,
    isLoading: isEventHardwareLoading,
    error: eventHardwareError,
    mutate: mutateEventHardware
  } = useEventdestinyhardwareList({ event: eventId });

	const handleActivateEvent = async (eventId: string) => {
		await eventsActivateCreate(eventId);
      toast.success('Event activated successfully');
      mutateThematicQuestions();
      mutateEvents();
	}
	
	const formatDate = (date: string) => {
		return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_SHORT);
	}

  if (!isEventsEnabled) {
    return <div>Events are not enabled</div>;
  }

  const thematicQuestionsHeader = useMemo(() => {
    return (
      <div className="text-lg font-bold cursor-pointer flex flex-row gap-2 items-center" onClick={() => setShowThematicQuestions(!showThematicQuestions)}>
        Thematic Questions {thematicQuestions?.length || 0}
        <KeyboardArrowRightIcon className={`transition-transform duration-300 ${showThematicQuestions ? 'rotate-90' : ''}`} />
      </div>
    )
  }, [showThematicQuestions, thematicQuestions?.length])

  const eventTracksHeader = useMemo(() => {
    return (
      <div className="text-lg font-bold cursor-pointer flex flex-row gap-2 items-center" onClick={() => setShowEventTracks(!showEventTracks)}>
        Prize Tracks {eventTracks?.length || 0}
        <KeyboardArrowRightIcon className={`transition-transform duration-300 ${showEventTracks ? 'rotate-90' : ''}`} />
      </div>
    )
  }, [showEventTracks, eventTracks?.length])

  const eventHardwareHeader = useMemo(() => {
    return (
      <div className="text-lg font-bold cursor-pointer flex flex-row gap-2 items-center" onClick={() => setShowEventHardware(!showEventHardware)}>
        Hardware Tracks {eventHardware?.length || 0}
        <KeyboardArrowRightIcon className={`transition-transform duration-300 ${showEventHardware ? 'rotate-90' : ''}`} />
      </div>
    )
  }, [showEventHardware, eventHardware?.length])

  if (isLoadingEvents) {
		return <Loader />
	}

	return (
		<div className="p-6">
      <div className="flex flex-col gap-4">
        {events?.sort((a: Event, b: Event) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()).map((event: Event) => {
          return (
            <div key={event.id} className="border-b border-gray-200 pb-4 flex justify-between items-center">
              <div>
                <div className="text-lg font-bold">{event.name}</div>
                <div>{event.is_active ? 'Active Event' : "Inactive"}</div>
                <div>{formatDate(event.start_date)} - {formatDate(event.end_date)}</div>
              </div>
              <div>
                <button 
                  className={`bg-blue-500 text-white px-4 py-2 rounded-md ${event.is_active ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={event.is_active}
                  onClick={() => handleActivateEvent(event?.id ?? '')}
                >
                  Activate
                </button>
              </div>
            </div>
          )
        })}
        {isThematicQuestionsLoading ? <Loader /> : (
        <div className="flex flex-col gap-4">
          {thematicQuestionsHeader}
          {showThematicQuestions && (
            <div className="flex flex-col gap-4">
              {thematicQuestions?.map((question: ApplicationQuestion) => {
                return (
                  <div key={question.id} className="border-b border-gray-200 pb-4 flex flex-col gap-2 justify-between items-start">
                    <div>{question.question_text}</div>
                      <div className="flex flex-col gap-2 pl-4">
                        {question.choices?.map((choice: ApplicationQuestionChoice) => {
                          return (
                            <div key={choice.id} className="flex flex-col gap-2 pl-4">
                              <div key={`${choice.id}-${choice.choice_key}`} className="text-sm text-gray-500">{choice.choice_key}: {choice.choice_text}</div>
                            </div>
                          )
                        })}
                      </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        )}
        {isEventTracksLoading ? <Loader /> : (
        <div className="flex flex-col gap-4">
          {eventTracksHeader}
          {showEventTracks && (
            <div className="flex flex-col gap-4">
              {eventTracks?.map((track: EventTrack) => {
                return (
                  <div key={track.id} className="border-b border-gray-200 pb-4 flex flex-col gap-2 justify-between items-start">
                    <div>{track.name}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        )}
        {isEventHardwareLoading ? <Loader /> : (
        <div className="flex flex-col gap-4">
          {eventHardwareHeader}
          {showEventHardware && (
            <div className="flex flex-col gap-4">
              {eventHardware?.map((hardware: EventDestinyHardware) => {
                return (
                  <div key={hardware.id} className="border-b border-gray-200 pb-4 flex flex-col gap-2 justify-between items-start">
                    <div>{hardware.name}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        )}
      </div>
		</div>
	)
}