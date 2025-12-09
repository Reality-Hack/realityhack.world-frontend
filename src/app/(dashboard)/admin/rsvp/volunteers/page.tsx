import RSVPTable from '@/components/admin/RSVPTable';
import { EventrsvpsListParticipationClass } from '@/types/models';

export default async function Volunteers() {
  return (
    <div className="pb-8 ">
      <RSVPTable type={EventrsvpsListParticipationClass.V} />
    </div>
  );
}
