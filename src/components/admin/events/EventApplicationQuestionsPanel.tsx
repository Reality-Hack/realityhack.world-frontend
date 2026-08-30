import EventConfigurableQuestionsPanel from '@/components/admin/events/EventConfigurableQuestionsPanel';
import { ApplicationquestionsListFormType } from '@/types/models';

export default function EventApplicationQuestionsPanel(): JSX.Element {
  return (
    <EventConfigurableQuestionsPanel
      formType={ApplicationquestionsListFormType.A}
      questionKindLabel="application"
    />
  );
}
