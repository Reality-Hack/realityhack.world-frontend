import ApplicationTable from '@/components/admin/applications/ApplicationTable';
import { ApplicationsListParticipationClass } from '@/types/models';

export default function Participants() {
  return (
    <div className="pb-8 ">
      <ApplicationTable type={ApplicationsListParticipationClass.P} />
    </div>
  );
}
