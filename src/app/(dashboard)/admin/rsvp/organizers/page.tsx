import RSVPTable from '@/components/admin/RSVPTable';

export default async function organizers() {
  return (
    <div className="pb-8 ">
      <RSVPTable type="O" />
    </div>
  );
}
