import RSVPTable from '@/components/admin/RSVPTable';
import { EventrsvpsListParticipationClass } from '@/types/models';
export default async function Sponsors() {
  return (
    <div className="pb-8 ">
      <RSVPTable type={EventrsvpsListParticipationClass.S} />
    </div>
  );
}
