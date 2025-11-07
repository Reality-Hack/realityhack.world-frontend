'use client';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useEventsList, eventsActivateCreate, useApplicationquestionsList } from '@/types/endpoints'
import { ApplicationQuestion, ApplicationQuestionChoice, Event } from '@/types/models'
import { DateTime } from 'luxon';
import Loader from '@/components/Loader';
import { toast } from 'sonner';

export default function EventsAdminPage() {
	const { data: session } = useSession();
	const { 
    data: events, 
    isLoading: isLoadingEvents,
    mutate: mutateEvents
  } = useEventsList({}, {
		swr: { enabled: !!session?.access_token },
		request: {
			headers: {
				'Authorization': `JWT ${session?.access_token}`
			}
		}
	})

  const { 
    data: thematicQuestions, 
    isLoading: isThematicQuestionsLoading, 
    error: thematicQuestionsError,
    mutate: mutateThematicQuestions
  } = useApplicationquestionsList();

	const handleActivateEvent = async (eventId: string) => {
		await eventsActivateCreate(eventId, {
			headers: {
				'Authorization': `JWT ${session?.access_token}`
			}
		});
    toast.success('Event activated successfully');
    mutateThematicQuestions();
    mutateEvents();
	}
	
	const formatDate = (date: string) => {
		return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_SHORT);
	}

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
        <div className="flex flex-col gap-4">
          <div className="text-lg font-bold">Thematic Questions</div>
          <div className="flex flex-col gap-4">
            {thematicQuestions?.map((question: ApplicationQuestion) => {
              return (
                <div key={question.id} className="border-b border-gray-200 pb-4 flex flex-col gap-2 justify-between items-start">
                  <div>{question.question_text}</div>
                  {question.choices?.map((choice: ApplicationQuestionChoice) => {
                    return (
                      <div key={choice.id} className="flex flex-col gap-2 pl-4">
                        <div key={`${choice.id}-${choice.choice_key}`} className="text-sm text-gray-500">{choice.choice_key}: {choice.choice_text}</div>
                      </div>
                    )
                  })}

                </div>
              )
            })}
          </div>
        </div>
      </div>
		</div>
	)
}