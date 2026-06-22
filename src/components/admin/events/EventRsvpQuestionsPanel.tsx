import EventConfigurableQuestionsPanel from '@/components/admin/events/EventConfigurableQuestionsPanel';
import { ApplicationquestionsListFormType } from '@/types/models';

export default function EventRsvpQuestionsPanel(): JSX.Element {
  return (
    <EventConfigurableQuestionsPanel
      formType={ApplicationquestionsListFormType.R}
      questionKindLabel="RSVP"
    />
  );
}
