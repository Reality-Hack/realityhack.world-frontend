import RSVPTable from '@/components/admin/RSVPTable';
import { EventrsvpsListParticipationClass } from '@/types/models';

export default function Participants() {
  return (
    <div className="pb-8 ">
      <RSVPTable type={EventrsvpsListParticipationClass.M} />
    </div>
  );
}
