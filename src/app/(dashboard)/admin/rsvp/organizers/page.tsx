import RSVPTable from '@/components/admin/RSVPTable';
import { EventrsvpsListParticipationClass } from '@/types/models';

export default function organizers() {
  return (
    <div className="pb-8 ">
      <RSVPTable type={EventrsvpsListParticipationClass.O} />
    </div>
  );
}
